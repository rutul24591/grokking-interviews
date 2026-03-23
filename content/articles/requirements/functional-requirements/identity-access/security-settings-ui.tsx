"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-settings-dashboard.svg"
          alt="Security Settings Dashboard"
          caption="Security Settings Dashboard — showing centralized security management UI"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-mfa-management.svg"
          alt="Security Mfa Management"
          caption="Security MFA Management — showing MFA enrollment, recovery, and device management"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-recommendations.svg"
          alt="Security Recommendations"
          caption="Security Recommendations — showing adaptive security suggestions based on user behavior"
        />
      
        <p>
          For staff and principal engineers, implementing security settings requires
          understanding security UX, risk communication, actionable recommendations,
          and balancing comprehensiveness with usability. The implementation must
          make security accessible to non-technical users while providing advanced
          options for power users.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready security settings page must provide comprehensive security management with clear UX.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Dashboard</h3>
          <ul className="space-y-3">
            <li>
              <strong>Security Score:</strong> Visual indicator (0-100 or Excellent/Good/Fair/Poor).
              Color-coded. Based on security factors.
            </li>
            <li>
              <strong>Security Checklist:</strong> MFA enabled, email verified, phone verified,
              recent password change, backup codes downloaded, sessions reviewed.
            </li>
            <li>
              <strong>Recommendations:</strong> Actionable items to improve security.
              "Enable MFA for +30 points".
            </li>
            <li>
              <strong>Progress:</strong> Show improvement over time. Gamification for engagement.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">MFA Management</h3>
          <ul className="space-y-3">
            <li>
              <strong>Enrolled Methods:</strong> List all MFA methods (TOTP, SMS, WebAuthn).
              Show status (enabled/disabled).
            </li>
            <li>
              <strong>Add Method:</strong> Button to enroll new method. Guide through setup.
            </li>
            <li>
              <strong>Remove Method:</strong> Require verification before removing.
              Can't remove last method.
            </li>
            <li>
              <strong>Reorder:</strong> Set default/preferred method. Drag to reorder.
            </li>
            <li>
              <strong>Backup Codes:</strong> Generate new codes. Download/print.
              Regenerate invalidates old.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Management</h3>
          <ul className="space-y-3">
            <li>
              <strong>Active Sessions:</strong> List all active sessions with device,
              location, last active time.
            </li>
            <li>
              <strong>Current Session:</strong> Mark current session. Can't terminate self.
            </li>
            <li>
              <strong>Terminate Session:</strong> Allow terminating other sessions.
              Confirm before termination.
            </li>
            <li>
              <strong>Terminate All:</strong> Log out all other devices. Confirm action.
            </li>
            <li>
              <strong>Refresh:</strong> Auto-refresh session list periodically.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Login History</h3>
          <ul className="space-y-3">
            <li>
              <strong>Recent Logins:</strong> List last 10-20 logins with date, time,
              device, location, status.
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
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Require password confirmation for sensitive changes</li>
          <li>Invalidate sessions after password change</li>
          <li>Notify users of security changes</li>
          <li>Log all security events for audit</li>
          <li>Use secure session management</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear security status display</li>
          <li>Actionable recommendations</li>
          <li>Progress indicators for security score</li>
          <li>Easy MFA enrollment flow</li>
          <li>Clear session information</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Alerts</h3>
        <ul className="space-y-2">
          <li>Alert on new device login</li>
          <li>Alert on password change</li>
          <li>Alert on MFA changes</li>
          <li>Alert on suspicious activity</li>
          <li>Provide clear action options</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track MFA adoption rate</li>
          <li>Monitor security score distribution</li>
          <li>Alert on unusual login patterns</li>
          <li>Track session termination rate</li>
          <li>Monitor security alert engagement</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No security score:</strong> Users don't know security status.
            <br /><strong>Fix:</strong> Implement visual security score/health indicator.
          </li>
          <li>
            <strong>Poor MFA UX:</strong> Hard to enable MFA.
            <br /><strong>Fix:</strong> Clear step-by-step enrollment flow. QR code + manual entry.
          </li>
          <li>
            <strong>No session info:</strong> Users can't see active sessions.
            <br /><strong>Fix:</strong> Show device, location, last active time for each session.
          </li>
          <li>
            <strong>No login history:</strong> Can't detect unauthorized access.
            <br /><strong>Fix:</strong> Show recent logins with location, device info.
          </li>
          <li>
            <strong>No security alerts:</strong> Users unaware of security changes.
            <br /><strong>Fix:</strong> Notify on password change, MFA changes, new devices.
          </li>
          <li>
            <strong>Poor recommendations:</strong> Users don't know how to improve security.
            <br /><strong>Fix:</strong> Provide actionable recommendations with clear benefits.
          </li>
          <li>
            <strong>No session termination:</strong> Can't log out other devices.
            <br /><strong>Fix:</strong> Allow terminating individual or all sessions.
          </li>
          <li>
            <strong>No password confirmation:</strong> Changes without verification.
            <br /><strong>Fix:</strong> Require password for sensitive changes.
          </li>
          <li>
            <strong>Poor mobile UX:</strong> Hard to manage on mobile.
            <br /><strong>Fix:</strong> Mobile-optimized layout, touch-friendly controls.
          </li>
          <li>
            <strong>No export:</strong> Can't download security records.
            <br /><strong>Fix:</strong> Allow exporting login history, security events.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Score Calculation</h3>
        <p>
          Calculate security score based on multiple factors.
        </p>
        <ul className="space-y-2">
          <li><strong>MFA:</strong> +30 points for any MFA, +10 for multiple methods.</li>
          <li><strong>Verified Contact:</strong> +20 for verified email, +20 for verified phone.</li>
          <li><strong>Password:</strong> +15 for recent change (90 days).</li>
          <li><strong>No Suspicious Activity:</strong> +15 for no recent suspicious activity.</li>
          <li><strong>Dynamic:</strong> Adjust weights based on threat landscape.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Fingerprinting</h3>
        <p>
          Identify sessions by device and behavior patterns.
        </p>
        <ul className="space-y-2">
          <li><strong>Device:</strong> User agent, screen resolution, timezone, fonts.</li>
          <li><strong>Behavior:</strong> Typing patterns, mouse movements, navigation patterns.</li>
          <li><strong>Location:</strong> IP geolocation, typical locations.</li>
          <li><strong>Risk Score:</strong> Calculate risk for each session based on fingerprint.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Alerts</h3>
        <p>
          Notify users of important security events.
        </p>
        <ul className="space-y-2">
          <li><strong>New Device:</strong> Alert on login from unrecognized device.</li>
          <li><strong>Password Change:</strong> Alert when password is changed.</li>
          <li><strong>MFA Changes:</strong> Alert when MFA is enabled/disabled.</li>
          <li><strong>Suspicious Activity:</strong> Alert on unusual patterns.</li>
          <li><strong>Action Options:</strong> Provide "Was this you?" and "Secure account" options.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connected Apps</h3>
        <p>
          Manage third-party app access.
        </p>
        <ul className="space-y-2">
          <li><strong>List Apps:</strong> Show all connected OAuth apps with permissions.</li>
          <li><strong>Last Used:</strong> Show when each app last accessed account.</li>
          <li><strong>Revoke Access:</strong> Allow revoking app access.</li>
          <li><strong>Confirm Revocation:</strong> Confirm before revoking access.</li>
          <li><strong>Activity:</strong> Show recent API activity per app.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design a security settings page?</p>
            <p className="mt-2 text-sm">
              A: Centralized dashboard with: (1) Security score/health indicator, (2) Security checklist (MFA, verified contact, etc.), (3) MFA management, (4) Session management, (5) Login history, (6) Security alerts, (7) Connected apps. Make it actionable with clear recommendations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate security score?</p>
            <p className="mt-2 text-sm">
              A: Weighted factors: MFA enabled (+30), verified email (+20), verified phone (+20), recent password change (+15), no suspicious activity (+15). Adjust weights based on threat landscape. Show progress over time. Gamify with badges/achievements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you display active sessions?</p>
            <p className="mt-2 text-sm">
              A: List with: device type/icon, browser, OS, location (city, country), last active time, IP address. Mark current session. Allow terminating individual sessions or all sessions. Confirm before termination. Auto-refresh list periodically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle security alerts?</p>
            <p className="mt-2 text-sm">
              A: Alert on: new device login, password change, MFA changes, suspicious activity. Send via email and in-app notification. Provide clear action options ("Was this you?", "Secure account"). Include timestamp, location, device info.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage MFA adoption?</p>
            <p className="mt-2 text-sm">
              A: Multi-pronged approach: (1) Show security score impact (+30 points), (2) Clear enrollment flow with QR code, (3) Offer multiple methods (TOTP, SMS, WebAuthn), (4) Provide backup codes, (5) Remind users periodically, (6) Require for sensitive actions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle connected apps?</p>
            <p className="mt-2 text-sm">
              A: List all OAuth apps with: app name, permissions granted, last used date. Allow revoking access. Confirm before revoking. Show recent API activity per app. Warn about high-permission apps. Allow viewing app privacy policy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you display login history?</p>
            <p className="mt-2 text-sm">
              A: List last 10-20 logins with: date, time, device, browser, location (map view optional), status (success/failed). Allow filtering by date, device type, status. Allow exporting history. Highlight failed attempts for security awareness.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for security settings?</p>
            <p className="mt-2 text-sm">
              A: MFA adoption rate, security score distribution, session termination rate, security alert engagement, connected apps per user, login history views. Track by user segment. Monitor for anomalies (spike in session terminations).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session termination?</p>
            <p className="mt-2 text-sm">
              A: Invalidate refresh token on server. Add token to denylist. Clear client-side tokens. Redirect to login. Notify user of termination. Log termination event. For terminate-all: invalidate all tokens, notify user, log all terminations.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - Authentication Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://docs.openfga.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenFGA - Fine-Grained Authorization</a></li>
          <li><a href="https://www.cerbos.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Cerbos - Policy as Code</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authorization Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Security Settings</h3>
        <p>
          Social platform with 500M users managing account security and privacy.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Low MFA adoption (5%). Users unaware of security risks. Complex security settings overwhelm users.</li>
          <li><strong>Solution:</strong> Security score dashboard (0-100). One-click MFA enrollment. Security recommendations prioritized. Login alerts for new devices.</li>
          <li><strong>Result:</strong> MFA adoption increased to 45%. Account takeovers reduced by 80%. User engagement with security improved.</li>
          <li><strong>Security:</strong> MFA enforcement, login monitoring, session management.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Security Settings</h3>
        <p>
          Online banking with mandatory security controls and transaction alerts.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires MFA. Customers need transaction alerts. Travel notification for fraud prevention.</li>
          <li><strong>Solution:</strong> Mandatory MFA setup. Customizable transaction alerts (amount threshold). Travel notification feature. Biometric option for mobile.</li>
          <li><strong>Result:</strong> Passed regulatory audits. Fraud reduced by 90%. Customer satisfaction high.</li>
          <li><strong>Security:</strong> MFA enforcement, real-time alerts, travel notification, biometric auth.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Security Settings</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, compliance-driven security.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> SOC 2 requires security settings visibility. Admin controls vs user controls. Audit trail for security changes.</li>
          <li><strong>Solution:</strong> Admin security dashboard. User security settings with admin overrides. Audit log for all security changes. Compliance reports.</li>
          <li><strong>Result:</strong> Passed SOC 2 audits. Admin visibility improved. Zero unauthorized security changes.</li>
          <li><strong>Security:</strong> Admin controls, audit logging, compliance reporting.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Security Settings</h3>
        <p>
          HIPAA-compliant platform with 50,000 providers, break-glass access.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires access controls. Emergency access needed. Shared workstation security. Audit trail for compliance.</li>
          <li><strong>Solution:</strong> MFA for all providers. Break-glass access with audit. Auto-logout settings. Login history with location.</li>
          <li><strong>Result:</strong> Passed HIPAA audits. Emergency access maintained. Zero unauthorized access.</li>
          <li><strong>Security:</strong> MFA, break-glass audit, auto-logout, login monitoring.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Security Settings</h3>
        <p>
          Online gaming platform with 100M users, account value protection.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> High-value accounts targeted. Young users need parental controls. Item trading security.</li>
          <li><strong>Solution:</strong> MFA for trading. Parental controls for minors. Login alerts. Device management with session termination.</li>
          <li><strong>Result:</strong> Account theft reduced by 90%. Parent satisfaction improved. Trading fraud reduced by 85%.</li>
          <li><strong>Security:</strong> MFA for trading, parental controls, login alerts, device management.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
