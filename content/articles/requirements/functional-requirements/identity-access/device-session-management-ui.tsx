"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-device-session-management",
  title: "Device/Session Management UI",
  description: "Comprehensive guide to implementing device and session management interfaces covering active session display, device information, remote logout, security alerts, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "device-session-management-ui",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "session-management", "device-management", "security", "frontend"],
  relatedTopics: ["session-persistence", "logout", "security-settings", "authentication-service"],
};

export default function DeviceSessionManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Device/Session Management UI</strong> allows users to view and control
          their active sessions across devices. It provides visibility into where their
          account is logged in, enables remote logout of specific sessions, and alerts
          users to suspicious activity. This is a critical security feature for account
          protection.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-management.svg"
          alt="Device Session Management"
          caption="Device Session Management — showing device registration, trust levels, and session binding"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-security.svg"
          alt="Device Session Security"
          caption="Device Session Security — showing device fingerprinting, anomaly detection, and revocation"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/device-session-tracking.svg"
          alt="Device Session Tracking"
          caption="Device Session Tracking — showing device metadata, location tracking, and activity logs"
        />
      
        <p>
          For staff and principal engineers, implementing session management UI requires
          understanding session tracking, device fingerprinting, security alerting, and
          UX patterns that help users make informed security decisions. The implementation
          must balance security (detailed information) with privacy (not exposing too
          much device data).
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready session management UI must provide comprehensive session visibility and control.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Display</h3>
          <ul className="space-y-3">
            <li>
              <strong>Device Type:</strong> Desktop, mobile, tablet. Icon + text
              (🖥️ Windows, 📱 iPhone).
            </li>
            <li>
              <strong>Browser:</strong> Chrome, Safari, Firefox with version. Helps
              identify unknown devices.
            </li>
            <li>
              <strong>Location:</strong> City, country from IP. "San Francisco, US".
              Approximate, not precise.
            </li>
            <li>
              <strong>IP Address:</strong> Last 2 octets masked for privacy
              (192.168.x.x). Full IP in audit logs.
            </li>
            <li>
              <strong>Last Active:</strong> Relative time ("2 minutes ago", "3 days
              ago"). Helps identify stale sessions.
            </li>
            <li>
              <strong>Current Session:</strong> Highlight "This device" or
              "Current session".
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Actions</h3>
          <ul className="space-y-3">
            <li>
              <strong>Sign Out:</strong> Per-session "Sign out" button.
              Confirmation for non-current sessions.
            </li>
            <li>
              <strong>Sign Out All:</strong> Prominent "Sign out of all other devices"
              button.
            </li>
            <li>
              <strong>Confirmation:</strong> Dialog showing impact ("This will sign
              you out of 3 other devices").
            </li>
            <li>
              <strong>Use Case:</strong> Lost device, suspected compromise, selling
              device.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Naming</h3>
          <ul className="space-y-3">
            <li>
              <strong>Custom Names:</strong> Allow users to name devices ("Work
              Laptop", "Home PC").
            </li>
            <li>
              <strong>Auto-Naming:</strong> Suggest names based on device/browser
              ("Chrome on Windows").
            </li>
            <li>
              <strong>Use Case:</strong> Easier identification for users with many
              devices.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Alerts</h3>
          <ul className="space-y-3">
            <li>
              <strong>New Device Alert:</strong> Email/push notification on new device
              login.
            </li>
            <li>
              <strong>Location Alert:</strong> Alert on login from new country/region.
            </li>
            <li>
              <strong>Multiple Sessions:</strong> Warn if many active sessions
              (&gt;10).
            </li>
            <li>
              <strong>Quick Actions:</strong> "Was this you?" link in alert email.
              Quick revoke if not.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Require confirmation before terminating sessions</li>
          <li>Invalidate sessions on server immediately</li>
          <li>Notify users of session termination</li>
          <li>Log all session actions for audit</li>
          <li>Prevent terminating current session accidentally</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear device identification (icon, name, location)</li>
          <li>Show last active time for each session</li>
          <li>Highlight current session clearly</li>
          <li>Provide session naming for easy identification</li>
          <li>Clear confirmation before termination</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Alerts</h3>
        <ul className="space-y-2">
          <li>Alert on new device login</li>
          <li>Alert on login from new location</li>
          <li>Alert on many active sessions</li>
          <li>Provide quick action options</li>
          <li>Include device and location info in alerts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track session count per user</li>
          <li>Monitor session termination rate</li>
          <li>Alert on unusual session patterns</li>
          <li>Track new device rate</li>
          <li>Monitor alert engagement</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No session info:</strong> Users can't identify devices.
            <br /><strong>Fix:</strong> Show device type, browser, location, last active.
          </li>
          <li>
            <strong>No current session marking:</strong> Users terminate current session by mistake.
            <br /><strong>Fix:</strong> Clearly mark "This device". Require extra confirmation.
          </li>
          <li>
            <strong>No session naming:</strong> Hard to manage many devices.
            <br /><strong>Fix:</strong> Allow custom device names. Auto-suggest names.
          </li>
          <li>
            <strong>No security alerts:</strong> Users unaware of new logins.
            <br /><strong>Fix:</strong> Alert on new device, new location.
          </li>
          <li>
            <strong>No confirmation:</strong> Accidental session termination.
            <br /><strong>Fix:</strong> Confirm before terminating sessions.
          </li>
          <li>
            <strong>No session invalidation:</strong> Sessions remain active after logout.
            <br /><strong>Fix:</strong> Invalidate on server immediately. Clear client tokens.
          </li>
          <li>
            <strong>Poor mobile UX:</strong> Hard to manage on mobile.
            <br /><strong>Fix:</strong> Mobile-optimized layout, touch-friendly controls.
          </li>
          <li>
            <strong>No refresh:</strong> Session list becomes stale.
            <br /><strong>Fix:</strong> Auto-refresh session list periodically.
          </li>
          <li>
            <strong>No logout-all:</strong> Can't log out all devices at once.
            <br /><strong>Fix:</strong> Provide "logout all other devices" option.
          </li>
          <li>
            <strong>No monitoring:</strong> Can't detect suspicious patterns.
            <br /><strong>Fix:</strong> Monitor session patterns. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Termination Propagation</h3>
        <p>
          Ensure session termination propagates across all devices.
        </p>
        <ul className="space-y-2">
          <li><strong>WebSocket:</strong> Push termination event to connected devices.</li>
          <li><strong>Polling:</strong> Devices poll for session validity periodically.</li>
          <li><strong>Token Expiry:</strong> Short access token expiry limits window.</li>
          <li><strong>Refresh Invalidation:</strong> Revoke refresh token, prevents new access tokens.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trusted Devices</h3>
        <p>
          Allow users to mark devices as trusted.
        </p>
        <ul className="space-y-2">
          <li><strong>Mark Trusted:</strong> User marks device as trusted during login.</li>
          <li><strong>Skip MFA:</strong> Skip MFA on trusted devices.</li>
          <li><strong>Expiry:</strong> Trusted status expires after 30 days.</li>
          <li><strong>Management:</strong> Allow viewing and removing trusted devices.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Limits</h3>
        <p>
          Limit number of concurrent sessions per user.
        </p>
        <ul className="space-y-2">
          <li><strong>Limit:</strong> Max 10-20 concurrent sessions per user.</li>
          <li><strong>Oldest First:</strong> Terminate oldest session when limit reached.</li>
          <li><strong>Notify:</strong> Notify user when session is terminated due to limit.</li>
          <li><strong>Enterprise:</strong> Higher limits for enterprise accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you display active sessions to users?</p>
            <p className="mt-2 text-sm">
              A: List with: device type/icon, browser, OS, location (city, country), last active time, IP address (masked). Mark current session. Allow terminating individual sessions or all sessions. Confirm before termination. Auto-refresh list periodically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session termination?</p>
            <p className="mt-2 text-sm">
              A: Invalidate refresh token on server. Add token to denylist. Clear client-side tokens. Redirect to login. Notify user of termination. Log termination event. For terminate-all: invalidate all tokens, notify user, log all terminations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent accidental current session termination?</p>
            <p className="mt-2 text-sm">
              A: Clearly mark "This device" or "Current session". Require extra confirmation ("This will log you out"). Optionally disable terminate button for current session. Show warning dialog if user attempts to terminate current session.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle security alerts for new devices?</p>
            <p className="mt-2 text-sm">
              A: Alert on login from unrecognized device fingerprint. Send email and in-app notification. Include device info, location, timestamp. Provide "Was this you?" and "Secure account" action options. Allow quick session termination from alert.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement session limits?</p>
            <p className="mt-2 text-sm">
              A: Set max concurrent sessions (10-20). When limit reached, terminate oldest session. Notify user of termination. Allow enterprise accounts higher limits. Show session count in UI. Warn when approaching limit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle trusted devices?</p>
            <p className="mt-2 text-sm">
              A: Allow marking device as trusted during login. Skip MFA on trusted devices. Trusted status expires after 30 days. Allow viewing and removing trusted devices in settings. Require re-verification to mark as trusted.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure session termination propagates?</p>
            <p className="mt-2 text-sm">
              A: Multi-pronged approach: (1) Invalidate refresh token on server, (2) Add access token to denylist, (3) Short access token expiry (15 min) limits window, (4) Push termination event via WebSocket to connected devices, (5) Devices poll for session validity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for session management?</p>
            <p className="mt-2 text-sm">
              A: Sessions per user, session termination rate, new device rate, alert engagement rate, session duration distribution, concurrent session count. Track by user segment. Monitor for anomalies (spike in terminations).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management on mobile?</p>
            <p className="mt-2 text-sm">
              A: Mobile-optimized layout with: touch-friendly controls, swipe actions for termination, collapsible session details, clear current session marking, confirmation dialogs. Test on various screen sizes. Ensure accessibility.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Session Management</h3>
        <p>
          Social platform with 500M users accessing from multiple devices simultaneously.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users logged in on 5+ devices (phone, tablet, desktop, work computer). Need to see and manage all sessions. Suspicious activity detection.</li>
          <li><strong>Solution:</strong> Session list with device info, location, last active time. "Sign out all" button. New device alerts via email/push. One-tap session termination.</li>
          <li><strong>Result:</strong> 80% users review sessions quarterly. Account takeovers detected 90% faster. User trust improved.</li>
          <li><strong>Security:</strong> Device fingerprinting, geographic anomaly detection, real-time alerts.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Session Management</h3>
        <p>
          Online banking with strict security requirements and fraud detection.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> PCI-DSS requires session visibility. Fraud detection for new devices. Customers need to control access after phone loss.</li>
          <li><strong>Solution:</strong> Detailed session view (device, location, IP). Immediate "block device" option. SMS alert for new devices. Mandatory session review after suspicious activity.</li>
          <li><strong>Result:</strong> Fraud reduced by 85%. PCI-DSS compliance maintained. Customer confidence high.</li>
          <li><strong>Security:</strong> Device binding, real-time fraud scoring, mandatory session review.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Session Management</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, employee offboarding requirements.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> IT admins need to terminate sessions for departed employees. Compliance requires session audit. Multiple devices per employee.</li>
          <li><strong>Solution:</strong> Admin dashboard for session management. Bulk session termination. Session export for compliance. Automated termination on HR offboarding trigger.</li>
          <li><strong>Result:</strong> Offboarding time reduced from hours to minutes. Compliance audits passed. Zero unauthorized access post-termination.</li>
          <li><strong>Security:</strong> Admin action logging, automated termination, session audit export.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Session Management</h3>
        <p>
          Online gaming platform with cross-platform play (PC, console, mobile).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Account sharing detection. Cross-platform session tracking. Young users sharing accounts with friends.</li>
          <li><strong>Solution:</strong> Session list showing platform (PlayStation, Xbox, PC). Concurrent session limits. Parental controls for minor accounts. Account sharing warnings.</li>
          <li><strong>Result:</strong> Account sharing reduced by 70%. Parent satisfaction improved. Cross-platform visibility working.</li>
          <li><strong>Security:</strong> Platform binding, concurrent session limits, parental controls.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Provider Session Management</h3>
        <p>
          EHR system with 50,000 providers accessing from shared workstations.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Shared workstations in hospitals. Providers forget to logout. HIPAA requires session visibility. Quick session termination needed.</li>
          <li><strong>Solution:</strong> Simple session UI for shared workstations. "Quick logout" button. Auto-logout reminder. Session timeout warnings. Badge tap logout for NFC badges.</li>
          <li><strong>Result:</strong> HIPAA compliance maintained. Forgotten logout incidents reduced by 90%. Provider workflow efficient.</li>
          <li><strong>Security:</strong> Auto-logout, session timeout warnings, NFC badge integration.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
