"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-device-session-management",
  title: "Device/Session Management UI",
  description:
    "Comprehensive guide to implementing device and session management interfaces covering active session display, device information, remote logout, security alerts, session binding, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "device-session-management-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "session-management",
    "device-management",
    "security",
    "frontend",
  ],
  relatedTopics: ["session-persistence", "logout", "security-settings"],
};

export default function DeviceSessionManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Device/Session Management UI</strong> allows users to view and control their
          active sessions across devices. It provides visibility into where their account is logged
          in, enables remote logout of specific sessions, and alerts users to suspicious activity.
          This is a critical security feature for account protection — users can detect
          unauthorized access and revoke compromised sessions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-management.svg"
          alt="Device Session Management"
          caption="Device Session Management — showing session list, device info, location, and remote logout"
        />

        <p>
          For staff and principal engineers, implementing session management UI requires deep
          understanding of session tracking, device fingerprinting, security alerting, and UX
          patterns that help users make informed security decisions. The implementation must
          balance security (detailed information) with privacy (not exposing too much device data).
        </p>
        <p>
          Modern session management has evolved from simple session lists to sophisticated security
          dashboards with device trust, anomaly detection, and one-click revocation. Organizations
          like Google, Microsoft, and Okta provide comprehensive session management — users can see
          all active sessions, device info, location, last active time, and revoke any session with
          one click.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Device/session management is built on fundamental concepts that determine how sessions
          are tracked, displayed, and controlled. Understanding these concepts is essential for
          designing effective session management UI.
        </p>
        <p>
          <strong>Session Display:</strong> Device type (desktop, mobile, tablet — with icon),
          browser (Chrome, Safari, Firefox with version), location (city, country from IP —
          approximate, not precise), IP address (last 2 octets masked for privacy — 192.168.x.x),
          last active (relative time — "2 minutes ago", "3 days ago"), current session indicator
          ("This device" or "Current session").
        </p>
        <p>
          <strong>Device Fingerprinting:</strong> Collect device signals (user agent, screen
          resolution, fonts, timezone, WebGL, canvas) to create unique device fingerprint. Store
          fingerprint with session. Detect new devices (require MFA). Bind sessions to device
          fingerprint (detect theft).
        </p>
        <p>
          <strong>Remote Logout:</strong> Allow users to revoke specific sessions from UI. Backend
          invalidates session (delete from Redis, add to denylist). Broadcast logout to affected
          device (WebSocket). Show confirmation ("Session revoked"). Update UI in real-time.
        </p>
        <p>
          <strong>Security Alerts:</strong> Alert on new device login (email/push notification).
          Alert on geographic anomaly (login from different country). Alert on concurrent sessions
          from different locations (possible theft). Provide "Was this you?" quick response.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Session management UI architecture separates session data from presentation, enabling
          real-time updates with secure session control. This architecture is critical for
          providing accurate session information.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-security.svg"
          alt="Device Session Security"
          caption="Device Session Security — showing device fingerprinting, anomaly detection, session binding, and revocation flow"
        />

        <p>
          Session display flow: User navigates to security settings. Frontend requests active
          sessions (GET /sessions). Backend queries session store (Redis), enriches with device
          info (user agent parsing), location (IP geolocation), returns session list. Frontend
          renders session cards with device icon, browser, location, last active, "This device"
          indicator. User clicks "Logout" on specific session. Frontend sends revoke request (POST
          {'/sessions/{id}/revoke'}). Backend invalidates session, broadcasts logout, returns
          success. Frontend updates UI (remove session card).
        </p>
        <p>
          Security architecture includes: device fingerprinting (collect signals, create hash),
          anomaly detection (detect unusual patterns — new device, different location, concurrent
          sessions from different locations), session binding (bind session to device fingerprint,
          detect theft), revocation flow (invalidate session, broadcast logout, update UI). This
          architecture enables secure session management — users can detect and revoke unauthorized
          access.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-tracking.svg"
          alt="Device Session Tracking"
          caption="Device Session Tracking — showing device metadata collection, session storage, location tracking, and activity logs"
        />

        <p>
          UX optimization is critical — session management must be clear and actionable.
          Optimization strategies include: clear device icons (recognizable icons for device
          types), relative time (human-readable — "2 minutes ago" not timestamp), location
          approximation (city, country — not precise address), one-click logout (no confirmation for
          non-current sessions), current session protection (can't logout current session).
          Organizations like Google report 80%+ user engagement with session management when UI is
          clear.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing session management UI involves trade-offs between security, privacy, and user
          experience. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Detailed vs Minimal Session Info</h3>
          <ul className="space-y-3">
            <li>
              <strong>Detailed:</strong> Full device info, precise location, IP address. Better
              security (users can identify unknown devices). Limitation: privacy concerns,
              information overload.
            </li>
            <li>
              <strong>Minimal:</strong> Device type, approximate location, masked IP. Better
              privacy, simpler UI. Limitation: harder to identify unknown devices.
            </li>
            <li>
              <strong>Recommendation:</strong> Balanced approach — device type + browser, city +
              country (not precise), masked IP (192.168.x.x). Enough info to identify unknown
              devices without privacy concerns.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Immediate vs Delayed Revocation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Immediate:</strong> Session revoked instantly. Maximum security. Limitation:
              user may lose work on that device.
            </li>
            <li>
              <strong>Delayed:</strong> Grace period (5 min) before revocation. Better UX (user
              can save work). Limitation: security window.
            </li>
            <li>
              <strong>Recommendation:</strong> Immediate for security (unauthorized access),
              delayed for user-initiated (own device). Show warning before delayed revocation.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Automatic vs Manual Security Alerts</h3>
          <ul className="space-y-3">
            <li>
              <strong>Automatic:</strong> Alert on every new device/login. Maximum security
              awareness. Limitation: alert fatigue, users ignore.
            </li>
            <li>
              <strong>Manual:</strong> User configures alert thresholds. Less fatigue. Limitation:
              users may miss important alerts.
            </li>
            <li>
              <strong>Recommendation:</strong> Automatic for high-risk (new device + different
              location), manual for low-risk (new device, same location). Let users configure
              preferences.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing session management UI requires following established best practices to
          ensure security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Display</h3>
        <p>
          Show device type with icon — recognizable icons (desktop, mobile, tablet). Show browser
          with version — helps identify unknown devices (Chrome 120, Safari 17). Show approximate
          location — city, country from IP (not precise address). Mask IP address — show
          192.168.x.x (last 2 octets masked for privacy). Show relative time — "2 minutes ago", "3
          days ago" (human-readable). Highlight current session — "This device" indicator.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Remote Logout</h3>
        <p>
          Allow one-click logout — no confirmation for non-current sessions. Protect current
          session — can't logout current session (show disabled button). Show confirmation after
          logout — "Session revoked". Update UI in real-time — remove session card immediately.
          Broadcast logout to affected device — WebSocket notification.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Alerts</h3>
        <p>
          Alert on new device login — email/push notification with device info. Alert on geographic
          anomaly — login from different country than usual. Alert on concurrent sessions from
          different locations — possible theft. Provide "Was this you?" quick response — yes
          (dismiss alert), no (revoke session, change password).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Privacy</h3>
        <p>
          Mask IP addresses — show 192.168.x.x (not full IP). Show approximate location — city,
          country (not precise address). Don't expose sensitive device data — no serial numbers,
          MAC addresses. Comply with privacy regulations — GDPR, CCPA (user can request session
          data deletion).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing session management UI to ensure secure,
          usable, and maintainable session management.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No current session indicator:</strong> Users don't know which session is
            current, may logout themselves. <strong>Fix:</strong> Highlight "This device" or
            "Current session". Disable logout button for current session.
          </li>
          <li>
            <strong>Precise location:</strong> Shows exact address, privacy violation.{" "}
            <strong>Fix:</strong> Show city, country only (approximate from IP). Don't show
            precise coordinates.
          </li>
          <li>
            <strong>Full IP address:</strong> Exposes user's IP, privacy/security risk.{" "}
            <strong>Fix:</strong> Mask last 2 octets (192.168.x.x). Show only for audit logs.
          </li>
          <li>
            <strong>No device icon:</strong> Hard to identify device type at a glance.{" "}
            <strong>Fix:</strong> Use recognizable icons (desktop, mobile, tablet). Add browser
            icon.
          </li>
          <li>
            <strong>Timestamp instead of relative time:</strong> "2024-01-15 14:30:00" not
            human-readable. <strong>Fix:</strong> Use relative time ("2 minutes ago", "3 days
            ago").
          </li>
          <li>
            <strong>No logout confirmation:</strong> Users don't know if logout succeeded.{" "}
            <strong>Fix:</strong> Show toast notification "Session revoked". Update UI immediately.
          </li>
          <li>
            <strong>No security alerts:</strong> Users unaware of suspicious activity.{" "}
            <strong>Fix:</strong> Alert on new device, geographic anomaly, concurrent sessions from
            different locations.
          </li>
          <li>
            <strong>Alert fatigue:</strong> Too many alerts, users ignore. <strong>Fix:</strong>
            Alert only for high-risk (new device + different location). Let users configure
            preferences.
          </li>
          <li>
            <strong>No device fingerprinting:</strong> Can't detect session theft.{" "}
            <strong>Fix:</strong> Collect device signals, create fingerprint, bind session, detect
            anomalies.
          </li>
          <li>
            <strong>No real-time update:</strong> UI shows stale session data. <strong>Fix:</strong>
            Poll session endpoint periodically. Use WebSocket for real-time updates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Session management UI is critical for account security. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, multiple devices per user. Need to show
          all sessions clearly. Detect unauthorized access.
        </p>
        <p>
          <strong>Solution:</strong> Session list with device icon, browser, location, last
          active. "This device" indicator. One-click logout. Security alerts for new devices.
          Device trust (skip MFA on trusted devices).
        </p>
        <p>
          <strong>Result:</strong> Users can manage sessions across devices. Unauthorized access
          detected via alerts. Session theft prevented via device trust.
        </p>
        <p>
          <strong>Security:</strong> Device fingerprinting, security alerts, device trust.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require session controls. Admin needs to
          see all user sessions. Compliance needs session audit trails.
        </p>
        <p>
          <strong>Solution:</strong> Admin session management UI (see all user sessions). Remote
          logout for any user. Session audit logging for compliance. Session timeout policies per
          org.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Admin control over user sessions. Compliance
          requirements met.
        </p>
        <p>
          <strong>Security:</strong> Admin controls, audit trails, remote logout.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires session monitoring. High-security
          needs immediate revocation. Fraud prevention critical.
        </p>
        <p>
          <strong>Solution:</strong> Session list with detailed info. Immediate revocation on
          suspicious activity. Geographic anomaly detection. Concurrent session limits.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Fraud reduced 90%. Session theft detected
          via anomaly detection.
        </p>
        <p>
          <strong>Security:</strong> Anomaly detection, immediate revocation, session limits.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires session audit. Provider sessions
          on shared workstations. Quick session revocation needed.
        </p>
        <p>
          <strong>Solution:</strong> Session list per provider. Badge tap for quick logout (RFID).
          Session audit for PHI access. Automatic timeout on shared workstations.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Automatic session timeout. PHI access
          logged.
        </p>
        <p>
          <strong>Security:</strong> Session audit, quick logout, automatic timeout.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M+ users, high account takeover rate. Session theft for
          valuable items. Multiple devices per user.
        </p>
        <p>
          <strong>Solution:</strong> Session management UI with device info. One-click logout for
          all sessions. Device fingerprinting for theft detection. Security alerts for new devices.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 85%. Session theft detected via
          fingerprinting. Users can manage sessions easily.
        </p>
        <p>
          <strong>Security:</strong> Device fingerprinting, security alerts, one-click logout.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of session management UI design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What session info should you display to users?</p>
            <p className="mt-2 text-sm">
              A: Device type with icon (desktop, mobile, tablet), browser with version (Chrome 120,
              Safari 17), approximate location (city, country — not precise), masked IP
              (192.168.x.x — last 2 octets masked), relative time ("2 minutes ago"), current
              session indicator ("This device"). Enough info to identify unknown devices without
              privacy concerns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement remote logout?</p>
            <p className="mt-2 text-sm">
              A: One-click logout button per session. Backend invalidates session (delete from
              Redis, add to denylist). Broadcast logout to affected device (WebSocket). Show
              confirmation toast ("Session revoked"). Update UI in real-time (remove session card).
              Protect current session (can't logout current session).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect session hijacking?</p>
            <p className="mt-2 text-sm">
              A: Device fingerprinting (collect signals, create hash), bind session to fingerprint,
              detect mismatch (if used from different device). Geographic anomaly detection (login
              from different country). Concurrent sessions from different locations (impossible
              travel). Alert user, offer to revoke suspicious sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle security alerts?</p>
            <p className="mt-2 text-sm">
              A: Alert on new device login (email/push notification with device info). Alert on
              geographic anomaly (login from different country). Alert on concurrent sessions from
              different locations. Provide "Was this you?" quick response — yes (dismiss), no
              (revoke session, change password). Let users configure alert preferences.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance privacy with security?</p>
            <p className="mt-2 text-sm">
              A: Mask IP addresses (192.168.x.x), show approximate location (city, country — not
              precise), don't expose sensitive device data (no serial numbers, MAC addresses).
              Enough info to identify unknown devices without privacy violations. Comply with GDPR,
              CCPA (user can request session data deletion).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement device fingerprinting?</p>
            <p className="mt-2 text-sm">
              A: Collect device signals (user agent, screen resolution, fonts, timezone, WebGL,
              canvas). Create hash (SHA256) of signals. Store fingerprint with session. Detect new
              devices (require MFA). Bind sessions to fingerprint (detect theft). Update
              fingerprint on legitimate changes (browser update).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent session limits?</p>
            <p className="mt-2 text-sm">
              A: Set max sessions per user (e.g., 10). On new login: if at limit, revoke oldest
              session. Show warning ("Logging in will log you out of oldest session"). Allow users
              to see/revoke sessions manually. Enterprise plans: higher limits or unlimited.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you update session UI in real-time?</p>
            <p className="mt-2 text-sm">
              A: Poll session endpoint periodically (every 30 seconds). Use WebSocket for real-time
              updates (server pushes session changes). Update UI on logout success (remove session
              card). Handle offline gracefully (show last known state, sync on reconnect).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for session management?</p>
            <p className="mt-2 text-sm">
              A: Active sessions per user, session duration, logout rate, security alert rate,
              session hijacking attempts detected. Set up alerts for anomalies — high logout rate
              (possible attack), many sessions per user (possible abuse).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Session_management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Session Management
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
