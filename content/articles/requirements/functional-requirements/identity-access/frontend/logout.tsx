"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-logout",
  title: "Logout",
  description: "Comprehensive guide to implementing logout functionality covering session termination, token invalidation, multi-device logout, security considerations, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "logout",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "logout", "session", "security", "frontend"],
  relatedTopics: ["login-interface", "session-persistence", "device-session-management", "authentication-service"],
};

export default function LogoutArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Logout</strong> (also called Sign Out) is the process of terminating a user's 
          authenticated session and invalidating access tokens. It is a critical security feature 
          that allows users to end their session explicitly, protecting against unauthorized access 
          on shared or compromised devices.
        </p>
        <p>
          For staff and principal engineers, implementing logout requires understanding session 
          management, token invalidation strategies, multi-device synchronization, security 
          implications (token theft, session fixation), and UX considerations (confirming logout, 
          redirect behavior, clearing sensitive data). The implementation must be thorough to 
          prevent security vulnerabilities while providing clear feedback to users.
        </p>
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready logout implementation must handle multiple scenarios securely.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Logout Types</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single Session Logout:</strong> Terminate current session only. User 
              remains logged in on other devices. Most common default behavior.
            </li>
            <li>
              <strong>Logout All Devices:</strong> Terminate all active sessions across all 
              devices. Invalidates all refresh tokens. Required after password change or 
              security incident.
            </li>
            <li>
              <strong>Selective Logout:</strong> User chooses specific sessions to terminate 
              from session management UI. Useful for revoking access on lost devices.
            </li>
            <li>
              <strong>Automatic Logout:</strong> Session expires after inactivity (sliding 
              timeout) or absolute duration. Clear warning before auto-logout.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Frontend Implementation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Clear Tokens:</strong> Remove access token from memory, delete refresh 
              token cookie (set expiry to past), clear localStorage/sessionStorage for app 
              data.
            </li>
            <li>
              <strong>Clear Sensitive Data:</strong> Remove cached user data, clear form 
              autofill, reset application state, clear any PII from client-side storage.
            </li>
            <li>
              <strong>API Call:</strong> Notify server to invalidate session/refresh token. 
              Handle offline gracefully (clear locally anyway).
            </li>
            <li>
              <strong>Redirect:</strong> Navigate to login page or home page. Clear URL 
              parameters (may contain sensitive data). Show logout confirmation message.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Backend Implementation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Invalidate Refresh Token:</strong> Remove from session store (Redis), 
              add to denylist, or mark as revoked in database.
            </li>
            <li>
              <strong>Session Cleanup:</strong> Delete session record, clear session data, 
              log audit event (logout, timestamp, IP, device).
            </li>
            <li>
              <strong>Token Denylist:</strong> For JWT access tokens, add JTI to denylist 
              until expiry. Check denylist on validation.
            </li>
            <li>
              <strong>Broadcast Logout:</strong> For logout all devices, publish event to 
              invalidate sessions across all services. Use event stream (Kafka).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Proper logout implementation prevents session hijacking and unauthorized access.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Handling</h3>
          <ul className="space-y-3">
            <li>
              <strong>Immediate Invalidation:</strong> Refresh tokens must be invalidated 
              immediately on logout. Access tokens remain valid until expiry (mitigate with 
              short TTL).
            </li>
            <li>
              <strong>Token Rotation:</strong> On logout all, generate new refresh token 
              series. Old tokens become invalid.
            </li>
            <li>
              <strong>Secure Cookie Deletion:</strong> Set cookie with past expiry, same 
              domain/path/attributes as original. Clear all variations (www/non-www).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Post-Logout Security</h3>
          <ul className="space-y-3">
            <li>
              <strong>Prevent Back-Button Access:</strong> Clear browser history or use 
              no-cache headers. Redirect to login on back navigation.
            </li>
            <li>
              <strong>Clear Service Workers:</strong> Unregister service workers that may 
              cache authenticated responses. Clear cached API responses.
            </li>
            <li>
              <strong>Notify Other Tabs:</strong> Use BroadcastChannel to notify other tabs 
              of logout. All tabs should clear state simultaneously.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Confirmation:</strong> Show "You have been logged out" message. 
            Confirm successful logout.
          </li>
          <li>
            <strong>Logout Location:</strong> Place in user menu (top-right), settings page, 
            and mobile navigation. Make it easy to find.
          </li>
          <li>
            <strong>Confirmation Dialog:</strong> Optional for single logout, required for 
            "logout all devices" (destructive action).
          </li>
          <li>
            <strong>Preserve Context:</strong> After logout, redirect to login with return 
            URL. User can log back in and return to same page.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout with JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: JWTs can't be invalidated server-side (stateless). Solutions: (1) Short 
              expiry (15 min), (2) Token denylist (store JTI until expiry), (3) Use opaque 
              access tokens with server validation, (4) Invalidate refresh token to prevent 
              new access tokens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement logout across multiple tabs?</p>
            <p className="mt-2 text-sm">
              A: Use BroadcastChannel API to broadcast logout event. All tabs listen and 
              clear state simultaneously. Fallback: localStorage event (works across tabs). 
              Server: invalidate session, all tabs detect on next API call.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should logout require confirmation?</p>
            <p className="mt-2 text-sm">
              A: Single logout: no (frustrating, users logout frequently). Logout all 
              devices: yes (destructive, affects other sessions). Show impact ("This will 
              log you out of 3 other devices").
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout when offline?</p>
            <p className="mt-2 text-sm">
              A: Clear local state immediately (tokens, data). Queue logout API call for 
              when online. User is effectively logged out locally. Server invalidates 
              session when request arrives.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the difference between logout and token expiry?</p>
            <p className="mt-2 text-sm">
              A: Logout is explicit user action, immediate (client + server). Token expiry 
              is automatic, based on TTL. Logout should invalidate before expiry. Both 
              result in unauthenticated state, but logout provides user control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO logout?</p>
            <p className="mt-2 text-sm">
              A: Single Logout (SLO): notify IdP, IdP broadcasts to all connected SPs. 
              Complex, not always supported. Alternative: local logout only (user logged 
              out of your app, but not IdP or other apps). Clearer UX but less secure.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
