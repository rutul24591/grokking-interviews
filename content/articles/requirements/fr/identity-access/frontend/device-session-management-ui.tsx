"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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
        <p>
          For staff and principal engineers, implementing session management UI requires 
          understanding session tracking, device fingerprinting, security alerting, and 
          UX patterns that help users make informed security decisions. The implementation 
          must balance security (detailed information) with privacy (not exposing too 
          much device data).
        </p>
      </section>

      <section>
        <h2>Session Display</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Information</h3>
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
              <strong>Current Session Indicator:</strong> Highlight "This device" or 
              "Current session".
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session List UI</h3>
          <ul className="space-y-3">
            <li>
              <strong>Card Layout:</strong> Each session as a card with device info, 
              location, time, actions.
            </li>
            <li>
              <strong>Grouping:</strong> Group by device type or location for many 
              sessions.
            </li>
            <li>
              <strong>Sorting:</strong> Most recent first. Current session at top.
            </li>
            <li>
              <strong>Limit Display:</strong> Show 5-10 most recent. "View all" for 
              complete list.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Session Actions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Individual Session Logout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Sign Out Button:</strong> Per-session "Sign out" button. 
              Confirmation for non-current sessions.
            </li>
            <li>
              <strong>Current Session:</strong> Can't sign out current session from 
              this view (use logout feature).
            </li>
            <li>
              <strong>Feedback:</strong> Show "Signed out successfully" after action.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sign Out All Other Sessions</h3>
          <ul className="space-y-3">
            <li>
              <strong>Button:</strong> Prominent "Sign out of all other devices" 
              button.
            </li>
            <li>
              <strong>Confirmation:</strong> Dialog showing impact ("This will sign 
              you out of 3 other devices").
            </li>
            <li>
              <strong>Use Cases:</strong> Lost device, suspected compromise, selling 
              device.
            </li>
            <li>
              <strong>Feedback:</strong> Show count of sessions terminated.
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
      </section>

      <section>
        <h2>Security Alerts</h2>
        <ul className="space-y-3">
          <li>
            <strong>New Device Alert:</strong> Email/push notification on new device 
            login. "New sign-in from Chrome on Windows".
          </li>
          <li>
            <strong>Location Alert:</strong> Alert on login from new country/region. 
            "Sign-in from unusual location".
          </li>
          <li>
            <strong>Multiple Sessions:</strong> Warn if many active sessions
            (&gt;10). "You have 12 active sessions".
          </li>
          <li>
            <strong>Quick Actions:</strong> "Was this you?" link in alert email. 
            Quick revoke if not.
          </li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Identification:</strong> Help users identify their devices. 
            Icons, names, last active.
          </li>
          <li>
            <strong>Warning for Unknown:</strong> Highlight sessions user might not 
            recognize. "Don't recognize this device?"
          </li>
          <li>
            <strong>Easy Revocation:</strong> One-click logout for individual 
            sessions. Confirmation for bulk.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Full-width cards, large touch 
            targets, swipe actions.
          </li>
          <li>
            <strong>Empty State:</strong> "Only one active session" when no other 
            devices. Reassuring message.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track active sessions?</p>
            <p className="mt-2 text-sm">
              A: Store session metadata in Redis: session_id, user_id, device_info, 
              IP, location, created_at, last_activity. Update last_activity on each 
              request. Query by user_id for session list.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you determine device/location info?</p>
            <p className="mt-2 text-sm">
              A: User-Agent parsing (ua-parser-js) for device/browser. IP geolocation 
              API (MaxMind, IPinfo) for location. Store on session creation, update 
              if significantly different.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you alert users about new sessions?</p>
            <p className="mt-2 text-sm">
              A: Always alert on new device + new location. Optional for known device 
              new location (travel). Don't alert on same device/browser (noise). 
              Provide quick revoke option.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session cleanup?</p>
            <p className="mt-2 text-sm">
              A: Auto-expire sessions after inactivity (30 days). Periodic cleanup 
              job deletes expired sessions. Limit max sessions per user (50). Oldest 
              sessions auto-logged-out when limit reached.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you show IP addresses to users?</p>
            <p className="mt-2 text-sm">
              A: Show partial IP (mask last 2 octets) for privacy. Full IP in audit 
              logs for security investigations. Balance: enough info to identify 
              device, not enough for privacy concerns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management for API clients?</p>
            <p className="mt-2 text-sm">
              A: Show API clients separately ("Connected Apps"). Display app name, 
              permissions, last used. Allow revoking app access. Different from 
              browser sessions—API tokens may be long-lived.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
