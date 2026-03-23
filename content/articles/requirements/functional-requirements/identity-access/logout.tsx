"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-flow.svg"
          alt="Logout Flow"
          caption="Logout Flow — showing token invalidation, session cleanup, and redirect"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-patterns.svg"
          alt="Logout Patterns"
          caption="Logout Patterns — comparing local, global, and federated logout"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-security.svg"
          alt="Logout Security"
          caption="Logout Security — showing CSRF protection, token blacklisting, and device-specific logout"
        />
      
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
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Invalidation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Access Tokens:</strong> Short-lived (15 min). Can't revoke directly
              (stateless). Wait for natural expiry.
            </li>
            <li>
              <strong>Refresh Tokens:</strong> Long-lived. Revoke on server by deleting from
              database or adding to denylist.
            </li>
            <li>
              <strong>Token Denylist:</strong> Store revoked token IDs (jti) with expiry.
              Check on each token refresh.
            </li>
            <li>
              <strong>Session Invalidation:</strong> Delete session record from database.
              Invalidate all associated tokens.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Client-Side Cleanup</h3>
          <ul className="space-y-3">
            <li>
              <strong>Clear Tokens:</strong> Remove access token, refresh token from
              localStorage/memory.
            </li>
            <li>
              <strong>Clear State:</strong> Clear user data, cached data from client state.
            </li>
            <li>
              <strong>Clear Cookies:</strong> Delete authentication cookies (HttpOnly, Secure).
            </li>
            <li>
              <strong>Redirect:</strong> Navigate to login page or home page after logout.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Server-Side Cleanup</h3>
          <ul className="space-y-3">
            <li>
              <strong>Invalidate Session:</strong> Delete session from database. Invalidate
              all associated tokens.
            </li>
            <li>
              <strong>Revoke Tokens:</strong> Add refresh token to denylist. Delete from
              database.
            </li>
            <li>
              <strong>Log Event:</strong> Log logout event for audit trail. Include timestamp,
              IP, device info.
            </li>
            <li>
              <strong>Notify:</strong> Optionally notify user of logout (email for logout-all).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Invalidate refresh tokens on server</li>
          <li>Clear all client-side tokens and state</li>
          <li>Use POST for logout endpoint (not GET)</li>
          <li>Log all logout events for audit</li>
          <li>Invalidate all sessions after password change</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Provide clear logout confirmation</li>
          <li>Redirect to login or home page after logout</li>
          <li>Clear error messages if logout fails</li>
          <li>Show session list for selective logout</li>
          <li>Confirm logout-all action (destructive)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Device</h3>
        <ul className="space-y-2">
          <li>Support logout-all devices</li>
          <li>Show active sessions with device info</li>
          <li>Allow selective session termination</li>
          <li>Sync logout across devices</li>
          <li>Show last active time per session</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <ul className="space-y-2">
          <li>Clear local state even if server fails</li>
          <li>Retry token invalidation on failure</li>
          <li>Log errors for debugging</li>
          <li>Don't expose internal errors to users</li>
          <li>Ensure logout always succeeds (client-side)</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Only clearing client tokens:</strong> Server session remains active.
            <br /><strong>Fix:</strong> Invalidate refresh token on server. Add to denylist.
          </li>
          <li>
            <strong>Using GET for logout:</strong> CSRF vulnerability, can be triggered by image tag.
            <br /><strong>Fix:</strong> Use POST for logout endpoint. Include CSRF token.
          </li>
          <li>
            <strong>Not invalidating all sessions:</strong> User remains logged in on other devices.
            <br /><strong>Fix:</strong> Provide logout-all option. Invalidate all refresh tokens.
          </li>
          <li>
            <strong>Not clearing client state:</strong> Sensitive data remains in memory.
            <br /><strong>Fix:</strong> Clear all tokens, user data, cached data on logout.
          </li>
          <li>
            <strong>No logout confirmation:</strong> Users unsure if logout succeeded.
            <br /><strong>Fix:</strong> Show clear confirmation message. Redirect to login page.
          </li>
          <li>
            <strong>Not logging logout events:</strong> No audit trail for security incidents.
            <br /><strong>Fix:</strong> Log all logout events with timestamp, IP, device info.
          </li>
          <li>
            <strong>Not invalidating after password change:</strong> Old sessions remain active.
            <br /><strong>Fix:</strong> Invalidate all sessions when password changes.
          </li>
          <li>
            <strong>Token reuse after logout:</strong> Tokens still valid after logout.
            <br /><strong>Fix:</strong> Add token to denylist. Check denylist on each request.
          </li>
          <li>
            <strong>No session management UI:</strong> Users can't see active sessions.
            <br /><strong>Fix:</strong> Show active sessions with device info, allow selective logout.
          </li>
          <li>
            <strong>Poor error handling:</strong> Logout fails silently.
            <br /><strong>Fix:</strong> Clear local state even if server call fails. Retry token invalidation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Denylist</h3>
        <p>
          Track revoked tokens to prevent reuse after logout.
        </p>
        <ul className="space-y-2">
          <li><strong>Storage:</strong> Store token IDs (jti) in Redis with TTL (token expiry).</li>
          <li><strong>Check:</strong> Verify token not in denylist on each refresh.</li>
          <li><strong>Cleanup:</strong> Let Redis auto-expire old entries.</li>
          <li><strong>Scale:</strong> Redis cluster for high-volume applications.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <p>
          Allow users to view and manage active sessions.
        </p>
        <ul className="space-y-2">
          <li><strong>Session List:</strong> Show device, location, last active time, IP address.</li>
          <li><strong>Selective Logout:</strong> Allow terminating specific sessions.</li>
          <li><strong>Current Session:</strong> Mark current session, prevent self-termination.</li>
          <li><strong>Refresh:</strong> Auto-refresh session list periodically.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Logout Propagation</h3>
        <p>
          Ensure logout propagates across all devices and services.
        </p>
        <ul className="space-y-2">
          <li><strong>WebSocket:</strong> Push logout event to connected devices.</li>
          <li><strong>Polling:</strong> Devices poll for session validity periodically.</li>
          <li><strong>Token Expiry:</strong> Short access token expiry limits window.</li>
          <li><strong>Refresh Invalidation:</strong> Revoke refresh token, prevents new access tokens.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security After Logout</h3>
        <p>
          Ensure security is maintained after logout.
        </p>
        <ul className="space-y-2">
          <li><strong>Clear Storage:</strong> Clear localStorage, sessionStorage, cookies.</li>
          <li><strong>Cache Control:</strong> Set no-cache headers on sensitive pages.</li>
          <li><strong>Back Button:</strong> Prevent back button from showing cached sensitive pages.</li>
          <li><strong>Token Blacklist:</strong> Add revoked tokens to blacklist immediately.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement logout securely?</p>
            <p className="mt-2 text-sm">
              A: Multi-step process: (1) Call server logout endpoint (POST) to invalidate refresh token. (2) Add token to denylist (Redis with TTL). (3) Clear all client-side tokens (localStorage, memory). (4) Clear user state and cached data. (5) Redirect to login page. (6) Log logout event for audit. Always clear local state even if server call fails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout across multiple devices?</p>
            <p className="mt-2 text-sm">
              A: Provide "logout all devices" option: (1) Invalidate all refresh tokens for user. (2) Add all token IDs to denylist. (3) Push logout event via WebSocket to connected devices. (4) Devices clear local state on receiving event. (5) Short access token expiry (15 min) limits window for devices not connected. Show active sessions list for selective logout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use GET or POST for logout?</p>
            <p className="mt-2 text-sm">
              A: Always use POST for logout. GET requests can be triggered by image tags, links (CSRF vulnerability). POST requires CSRF token, can't be triggered accidentally. Logout changes server state (invalidates tokens), so POST is semantically correct. Never use GET for state-changing operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent token reuse after logout?</p>
            <p className="mt-2 text-sm">
              A: Token denylist: (1) Store token ID (jti) in Redis when logout occurs. (2) Set TTL equal to token expiry. (3) Check denylist on each token refresh request. (4) Reject if token ID found in denylist. Access tokens are stateless, so short expiry (15 min) limits window. Refresh tokens are stateful, can be revoked immediately.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What do you clear on client-side logout?</p>
            <p className="mt-2 text-sm">
              A: Clear everything: (1) Access token (memory/localStorage). (2) Refresh token (HttpOnly cookie - server clears). (3) User data from state management. (4) Cached API responses. (5) Sensitive data from forms. (6) Clear browser cache for sensitive pages (no-cache headers). Redirect to login page after cleanup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout after password change?</p>
            <p className="mt-2 text-sm">
              A: Invalidate ALL sessions: (1) Change password hash in database. (2) Invalidate all refresh tokens for user. (3) Add all token IDs to denylist. (4) Optionally notify user via email. (5) Require re-login on all devices. This ensures compromised sessions are terminated. User must log in again with new password.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement session management UI?</p>
            <p className="mt-2 text-sm">
              A: Show list of active sessions: (1) Fetch sessions from server (device, location, IP, last active). (2) Mark current session. (3) Allow terminating other sessions. (4) Confirm before terminating. (5) Refresh list after termination. (6) Show "last active" timestamp. (7) Highlight suspicious sessions (new location, device).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for logout?</p>
            <p className="mt-2 text-sm">
              A: Logout success rate, logout-all usage rate, average sessions per user, session duration, logout reason distribution (user-initiated, password change, security incident). Track failed logout attempts. Monitor for anomalies (spike in logout-all). Track token denylist size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout for SSO/OAuth users?</p>
            <p className="mt-2 text-sm">
              A: Single Logout (SLO) for SSO: (1) Clear local session. (2) Redirect to IdP logout endpoint. (3) IdP clears its session. (4) IdP propagates logout to other connected apps. For OAuth: (1) Clear local tokens. (2) Optionally revoke OAuth tokens at provider. (3) User must re-authenticate with provider for next login.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/CSRF_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP CSRF Prevention</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - HTTP Cookies Guide</a></li>
          <li><a href="https://www.rfc-editor.org/rfc/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">RFC 6749 - OAuth 2.0</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Logout</h3>
        <p>
          Large e-commerce platform with 50M users, cart persistence across sessions.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users expect cart to persist after logout. Guest checkout complicates logout flow. Mobile app background logout.</li>
          <li><strong>Solution:</strong> Cart linked to user_id (not session). Graceful logout: clear tokens, preserve cart data. Background logout for mobile (queue-based).</li>
          <li><strong>Result:</strong> Cart persistence maintained. 99.9% successful logout rate. Mobile app logout issues reduced by 80%.</li>
          <li><strong>Security:</strong> Token invalidation, session cleanup, secure redirect to home page.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Logout</h3>
        <p>
          Online banking platform with strict security and regulatory requirements.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires immediate session termination. Auto-logout after inactivity. Users forget to logout on shared computers.</li>
          <li><strong>Solution:</strong> Auto-logout (15 min idle). Browser tab close detection. "Logout all devices" option. Clear confirmation message. Redirect to login with session expired flag.</li>
          <li><strong>Result:</strong> Passed regulatory audits. Session hijacking attempts blocked. Customer trust maintained.</li>
          <li><strong>Security:</strong> Immediate token invalidation, server-side session deletion, audit logging, secure redirect.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Logout</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers using SAML/OIDC SSO.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Single Logout (SLO) across multiple apps. IdP-initiated logout propagation. Session sync with IdP policies.</li>
          <li><strong>Solution:</strong> SAML SLO binding. IdP-initiated logout handling. Local session cleanup + IdP redirect. Fallback for IdPs without SLO support.</li>
          <li><strong>Result:</strong> 99% SLO success rate. Enterprise compliance maintained. Support tickets reduced by 60%.</li>
          <li><strong>Security:</strong> IdP session invalidation, local token cleanup, audit logging for compliance.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Logout</h3>
        <p>
          Online gaming platform with 100M users, active game sessions.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users logout during active games. Game state preservation. Cross-platform logout (mobile, desktop, console).</li>
          <li><strong>Solution:</strong> Graceful logout: save game state, then logout. Cross-platform session termination. Queue-based logout for offline platforms.</li>
          <li><strong>Result:</strong> Zero game state loss. 99.9% logout success. Cross-platform sync working.</li>
          <li><strong>Security:</strong> Game state encryption, session invalidation, device-specific logout.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Portal Logout</h3>
        <p>
          HIPAA-compliant patient portal with 5M patients accessing medical records.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires automatic logout. Shared workstations in clinics. Emergency access needs special handling.</li>
          <li><strong>Solution:</strong> Auto-logout (5 min idle for clinics, 15 min for patients). Break-glass logout exception (audit logged). Clear logout confirmation. Quick re-auth for providers.</li>
          <li><strong>Result:</strong> Passed HIPAA audits. Provider workflow maintained. Zero unauthorized access via forgotten logout.</li>
          <li><strong>Security:</strong> Automatic timeout, session invalidation, break-glass audit, quick re-auth option.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
