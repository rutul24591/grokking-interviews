"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-security-settings",
  title: "Security Settings UI",
  description:
    "Comprehensive guide to implementing security settings interfaces covering MFA management, session review, login history, security alerts, password management, connected apps, and security recommendations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "security-settings-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "security-settings",
    "mfa",
    "sessions",
    "frontend",
  ],
  relatedTopics: ["mfa-setup", "device-session-management-ui", "account-settings-ui"],
};

export default function SecuritySettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Security Settings UI</strong> provides a centralized dashboard for users to
          manage their account security including MFA configuration, active sessions, login
          history, security alerts, password management, and connected apps. It empowers users to
          monitor and protect their accounts while providing transparency into security status.
          Security settings is often the most important settings page — users come here to protect
          their accounts from unauthorized access.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-settings-dashboard.svg"
          alt="Security Settings Dashboard"
          caption="Security Settings Dashboard — showing security score, MFA status, active sessions, login history, and security recommendations"
        />

        <p>
          For staff and principal engineers, implementing security settings requires deep
          understanding of security UX, risk communication, actionable recommendations, and
          balancing comprehensiveness with usability. The implementation must make security
          accessible to non-technical users while providing advanced options for power users.
        </p>
        <p>
          Modern security settings has evolved from simple password change forms to comprehensive
          security dashboards with security scores, actionable recommendations, and one-click
          security improvements. Organizations like Google, Microsoft, and Okta provide
          comprehensive security settings — users can see security score, enable MFA, review
          sessions, check login history, manage connected apps, and get personalized security
          recommendations.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Security settings is built on fundamental concepts that determine how security is
          presented and managed. Understanding these concepts is essential for designing effective
          security settings UI.
        </p>
        <p>
          <strong>Security Dashboard:</strong> Security score (visual indicator 0-100 or
          Excellent/Good/Fair/Poor — color-coded), security checklist (MFA enabled, email
          verified, phone verified, recent password change, backup codes downloaded, sessions
          reviewed), recommendations (actionable items to improve security — "Enable MFA for +30
          points"), progress tracking (show improvement over time — gamification for engagement).
        </p>
        <p>
          <strong>MFA Management:</strong> Enrolled methods list (TOTP, SMS, WebAuthn — show
          status enabled/disabled), enroll new method (step-by-step wizard), set default method
          (primary MFA method), recovery options (backup codes, recovery email/phone), disable
          method (require password confirmation).
        </p>
        <p>
          <strong>Session Review:</strong> Active sessions list (device, browser, location, last
          active), current session indicator ("This device"), remote logout (revoke specific
          session), logout all devices (revoke all sessions), session limits (max concurrent
          sessions).
        </p>
        <p>
          <strong>Login History:</strong> Recent logins list (timestamp, location, device,
          outcome), failed login attempts (timestamp, location, reason), suspicious activity
          alerts (highlight unusual logins), export login history (download for records).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Security settings architecture separates security data from presentation, enabling
          real-time updates with secure management. This architecture is critical for providing
          accurate security information.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-mfa-management.svg"
          alt="Security MFA Management"
          caption="MFA Management — showing enrollment flow, method list, recovery options, and disable flow"
        />

        <p>
          Security dashboard flow: User navigates to security settings. Frontend requests security
          data (GET /security/dashboard). Backend aggregates data (MFA status, sessions, login
          history, recommendations), calculates security score, returns dashboard data. Frontend
          renders security score (color-coded gauge), checklist (checked/unchecked items),
          recommendations (actionable cards with "Enable" buttons). User clicks recommendation.
          Frontend navigates to relevant section (MFA, sessions, etc.).
        </p>
        <p>
          MFA management flow: User clicks "Enable MFA". Frontend shows method selection (TOTP,
          SMS, WebAuthn). User selects method. Frontend shows enrollment wizard (step-by-step).
          User completes enrollment. Backend validates, enables MFA, generates backup codes.
          Frontend shows backup codes (force download). User confirms. MFA enabled.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-recommendations.svg"
          alt="Security Recommendations"
          caption="Security Recommendations — showing personalized recommendations based on security posture, risk level, and user behavior"
        />

        <p>
          Security recommendations architecture includes: risk assessment (analyze security posture
          — MFA enabled, password age, session count), personalized recommendations (based on risk
          — "Enable MFA" if not enabled, "Change password" if old), priority ordering (high-risk
          first), progress tracking (show impact — "+30 points"). This architecture enables
          actionable security — users know exactly what to improve.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing security settings involves trade-offs between comprehensiveness, simplicity,
          and user engagement. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Score vs Checklist</h3>
          <ul className="space-y-3">
            <li>
              <strong>Security Score:</strong> Single number (0-100), gamification, easy to
              understand. Limitation: oversimplifies security, users may obsess over score.
            </li>
            <li>
              <strong>Checklist:</strong> Specific items (MFA enabled, email verified), actionable.
              Limitation: no overall picture, users may not know priority.
            </li>
            <li>
              <strong>Recommendation:</strong> Both — score for overall picture, checklist for
              specifics. Score drives engagement, checklist drives action.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Automatic vs Manual Recommendations</h3>
          <ul className="space-y-3">
            <li>
              <strong>Automatic:</strong> System generates recommendations based on risk. Always
              up-to-date. Limitation: may recommend irrelevant items.
            </li>
            <li>
              <strong>Manual:</strong> Security team curates recommendations. High quality.
              Limitation: doesn't scale, may be outdated.
            </li>
            <li>
              <strong>Recommendation:</strong> Automatic with manual override. System generates
              recommendations, security team can add/modify. Best of both.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Simple vs Advanced Security Settings</h3>
          <ul className="space-y-3">
            <li>
              <strong>Simple:</strong> Basic options (password, MFA, sessions). Easy to understand.
              Limitation: power users want more control.
            </li>
            <li>
              <strong>Advanced:</strong> All options (API keys, audit logs, advanced MFA). Full
              control. Limitation: overwhelming for non-technical users.
            </li>
            <li>
              <strong>Recommendation:</strong> Progressive disclosure — basic options by default,
              "Advanced" toggle for more. Simple for most users, advanced for power users.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing security settings requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Dashboard</h3>
        <p>
          Show security score prominently — color-coded gauge (green/yellow/red). Display security
          checklist — checked/unchecked items with descriptions. Show recommendations — actionable
          cards with "Enable" buttons, show impact ("+30 points"). Track progress — show
          improvement over time (chart).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Management</h3>
        <p>
          List enrolled methods — show status (enabled/disabled), method icon. Provide enrollment
          wizard — step-by-step guide with screenshots. Allow setting default method — primary MFA
          method. Show recovery options — backup codes, recovery email/phone. Require password
          confirmation to disable MFA.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Review</h3>
        <p>
          Show active sessions — device icon, browser, location, last active. Highlight current
          session — "This device" indicator. Provide one-click logout — revoke specific session.
          Show logout all option — revoke all sessions (with confirmation). Show session limits —
          max concurrent sessions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Login History</h3>
        <p>
          Show recent logins — timestamp, location, device, outcome (success/failure). Highlight
          failed attempts — red color for failures. Alert on suspicious activity — unusual
          location, new device. Provide export — download login history (CSV, PDF).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing security settings to ensure secure, usable,
          and maintainable security settings.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No security score:</strong> Users don't know overall security posture.{" "}
            <strong>Fix:</strong> Show security score (0-100) with color coding. Explain how score
            is calculated.
          </li>
          <li>
            <strong>Vague recommendations:</strong> "Improve security" not actionable.{" "}
            <strong>Fix:</strong> Specific recommendations ("Enable MFA for +30 points"). Show
            impact.
          </li>
          <li>
            <strong>No MFA recovery:</strong> Users locked out if they lose MFA device.{" "}
            <strong>Fix:</strong> Force backup code download during enrollment. Show recovery
            options prominently.
          </li>
          <li>
            <strong>No current session indicator:</strong> Users don't know which session is
            current. <strong>Fix:</strong> Highlight "This device". Disable logout for current
            session.
          </li>
          <li>
            <strong>Technical jargon:</strong> "TOTP", "WebAuthn" confusing for non-technical
            users. <strong>Fix:</strong> Use plain language ("Authenticator app", "Security key").
            Show icons.
          </li>
          <li>
            <strong>No progress tracking:</strong> Users don't see improvement. <strong>Fix:</strong>
            Show progress chart over time. Celebrate milestones ("Security score improved by 50
            points!").
          </li>
          <li>
            <strong>Overwhelming options:</strong> Too many settings, users don't know where to
            start. <strong>Fix:</strong> Progressive disclosure — basic options first, "Advanced"
            toggle for more.
          </li>
          <li>
            <strong>No confirmation for dangerous actions:</strong> Users accidentally disable MFA.{" "}
            <strong>Fix:</strong> Require password confirmation for disabling MFA, logout all
            sessions.
          </li>
          <li>
            <strong>No login history:</strong> Users can't see past logins. <strong>Fix:</strong>
            Show recent logins (30 days). Provide export option.
          </li>
          <li>
            <strong>No suspicious activity alerts:</strong> Users unaware of unauthorized access.{" "}
            <strong>Fix:</strong> Highlight suspicious logins (unusual location, new device). Send
            email alerts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Security settings is critical for account protection. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users with varying technical knowledge. Need to
          make security accessible. Drive MFA adoption.
        </p>
        <p>
          <strong>Solution:</strong> Security checkup wizard (step-by-step). Security score with
          recommendations. One-click MFA enrollment. Session management with device info. Login
          history with suspicious activity alerts.
        </p>
        <p>
          <strong>Result:</strong> MFA adoption increased 50%. Users can manage security easily.
          Unauthorized access detected via alerts.
        </p>
        <p>
          <strong>Security:</strong> Security score, MFA enrollment, session management, login
          history.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require security controls. Admin needs
          to see user security posture. Compliance needs audit trails.
        </p>
        <p>
          <strong>Solution:</strong> Admin security dashboard (see all user security postures).
          Enforced MFA policies. Session timeout policies. Audit logging for all security changes.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Admin control over user security. Compliance
          requirements met.
        </p>
        <p>
          <strong>Security:</strong> Admin dashboard, enforced policies, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires security controls. High-security
          needs MFA for all users. Fraud prevention critical.
        </p>
        <p>
          <strong>Solution:</strong> Mandatory MFA enrollment. Login history with location.
          Suspicious activity alerts (email/SMS). Session timeout (15 min). No "remember me"
          option.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Fraud reduced 90%. Users aware of all
          logins.
        </p>
        <p>
          <strong>Security:</strong> Mandatory MFA, login history, suspicious activity alerts.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires access controls. Provider security
          settings. Audit trails for PHI access.
        </p>
        <p>
          <strong>Solution:</strong> MFA for all providers. Session timeout (15 min idle). Login
          history with location. Audit logging for all security changes. Badge tap for quick
          re-login.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Provider security managed. PHI access
          logged.
        </p>
        <p>
          <strong>Security:</strong> MFA, session timeout, login history, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M+ users, high account takeover rate. Young users need
          simple security. Parental controls.
        </p>
        <p>
          <strong>Solution:</strong> Security score with gamification. One-click MFA enrollment.
          Session management with device info. Login history. Parental controls for minor accounts.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 85%. MFA adoption 60%. Parental
          control effective.
        </p>
        <p>
          <strong>Security:</strong> Security score, MFA, session management, parental controls.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of security settings UI design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate security score?</p>
            <p className="mt-2 text-sm">
              A: Weighted factors — MFA enabled (+30 points), email verified (+10), phone verified
              (+10), recent password change (+10), backup codes downloaded (+10), sessions reviewed
              (+5), no suspicious activity (+25). Total 100 points. Show breakdown so users know
              how to improve.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you drive MFA adoption?</p>
            <p className="mt-2 text-sm">
              A: Security score impact ("Enable MFA for +30 points"), prominent placement (top of
              security settings), one-click enrollment (minimal steps), gamification (badge for
              enabling MFA), reminders (periodic prompts until enabled).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA recovery?</p>
            <p className="mt-2 text-sm">
              A: Force backup code download during enrollment (can't skip). Show recovery options
              prominently (recovery email, phone). Provide account recovery flow (for users who
              lost all MFA methods). Require identity verification for recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you present login history?</p>
            <p className="mt-2 text-sm">
              A: Recent logins list (30 days) — timestamp, location, device, outcome. Highlight
              failures (red color). Alert on suspicious activity (unusual location, new device).
              Provide export (CSV, PDF). Show map for visual representation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle suspicious activity?</p>
            <p className="mt-2 text-sm">
              A: Detect unusual patterns (new device + different location, concurrent sessions from
              different locations). Alert user immediately (email/SMS/push). Provide "Was this
              you?" quick response — yes (dismiss), no (revoke session, change password).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make security accessible to non-technical users?</p>
            <p className="mt-2 text-sm">
              A: Plain language (no jargon — "Authenticator app" not "TOTP"), visual indicators
              (icons, color coding), step-by-step wizards, progressive disclosure (basic options
              first, advanced toggle), contextual help (tooltips, links to docs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management?</p>
            <p className="mt-2 text-sm">
              A: Show active sessions (device, browser, location, last active). Highlight current
              session ("This device"). One-click logout (revoke specific session). Logout all
              option (with confirmation). Show session limits (max concurrent sessions).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track security progress?</p>
            <p className="mt-2 text-sm">
              A: Show security score over time (chart). Celebrate milestones ("Security score
              improved by 50 points!"). Show completed recommendations (checked items). Show
              pending recommendations (actionable cards).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for security settings?</p>
            <p className="mt-2 text-sm">
              A: MFA adoption rate, security score distribution, recommendation completion rate,
              session management usage, login history views, suspicious activity alerts. Set up
              alerts for anomalies — low MFA adoption, high suspicious activity.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
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
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Security Questions
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
