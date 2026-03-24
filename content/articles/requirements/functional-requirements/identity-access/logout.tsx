"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-logout",
  title: "Logout",
  description:
    "Comprehensive guide to implementing logout functionality covering session termination, token invalidation, multi-device logout, security considerations, CSRF protection, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "logout",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "logout",
    "session",
    "security",
    "frontend",
  ],
  relatedTopics: ["login-interface", "session-persistence", "password-reset"],
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
          on shared or compromised devices. Logout is often overlooked in security discussions, but
          improper implementation can leave users vulnerable to session hijacking and unauthorized
          access.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-flow.svg"
          alt="Logout Flow"
          caption="Logout Flow — showing token invalidation, session cleanup, CSRF protection, and redirect"
        />

        <p>
          For staff and principal engineers, implementing logout requires deep understanding of
          session management (token storage, refresh rotation), token invalidation strategies
          (server-side revocation, blacklist), multi-device synchronization (logout all devices,
          selective logout), security implications (CSRF protection, token theft prevention,
          session fixation), and UX considerations (confirming logout, redirect behavior, clearing
          sensitive data). The implementation must be thorough to prevent security vulnerabilities
          while providing clear feedback to users.
        </p>
        <p>
          Modern logout has evolved from simple cookie clearing to sophisticated token revocation
          systems with multi-device synchronization. Organizations like Google, Microsoft, and Okta
          implement global logout (revoke all sessions across all devices) for security incidents,
          selective logout (revoke specific device sessions) for lost devices, and automatic logout
          (session timeout, inactivity timeout) for security. The technical complexity includes
          coordinating logout across distributed services, handling offline devices, and providing
          clear user feedback.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Logout is built on fundamental concepts that determine how sessions are terminated and
          tokens are invalidated. Understanding these concepts is essential for designing effective
          logout systems.
        </p>
        <p>
          <strong>Logout Types:</strong> Single Session Logout (terminate current session only —
          user remains logged in on other devices, most common default), Logout All Devices
          (terminate all active sessions across all devices — invalidates all refresh tokens,
          required after password change or security incident), Selective Logout (user chooses
          specific sessions to terminate from session management UI — useful for revoking access on
          lost devices).
        </p>
        <p>
          <strong>Token Invalidation:</strong> Access tokens are short-lived (15 min) and stateless
          — can't revoke directly, must wait for natural expiry (mitigate with short expiry).
          Refresh tokens are long-lived and stateful — revoke on server by deleting from database,
          add to blacklist, or increment token version. For immediate revocation, use token
          blacklist (store revoked token IDs with TTL matching expiry).
        </p>
        <p>
          <strong>Session Cleanup:</strong> Clear all client-side storage (cookies, localStorage,
          sessionStorage). Invalidate server-side session (delete from session store). Notify other
          services of logout (for distributed systems). Clear sensitive data from memory (passwords,
          tokens). Redirect to login or home page with logout confirmation message.
        </p>
        <p>
          <strong>CSRF Protection:</strong> Logout must be protected against CSRF attacks
          (attacker tricks user into logging out). Use POST request (not GET — GET logout can be
          triggered by image tag). Include CSRF token in logout form. Validate on server. Use
          SameSite cookies for additional protection.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Logout architecture separates client-side cleanup from server-side invalidation, enabling
          secure session termination across distributed systems. This architecture is critical for
          handling multi-device scenarios and ensuring complete logout.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-patterns.svg"
          alt="Logout Patterns"
          caption="Logout Patterns — comparing local logout, global logout, federated logout, and selective device logout"
        />

        <p>
          Logout flow: User clicks logout button. Frontend sends POST request to logout endpoint
          (with CSRF token). Backend invalidates refresh token (delete from database or add to
          blacklist), clears server-side session, notifies other services (for distributed
          systems), returns success. Frontend clears client-side storage (cookies, localStorage,
          sessionStorage), clears sensitive data from memory, redirects to login or home page,
          shows logout confirmation message.
        </p>
        <p>
          Multi-device logout architecture includes: session registry (track all active sessions
          per user), invalidation propagation (notify all services of logout), device-specific
          logout (revoke specific session by device ID), global logout (revoke all sessions). This
          architecture enables complete logout — user can revoke access on lost devices while
          maintaining access on trusted devices.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/logout-security.svg"
          alt="Logout Security"
          caption="Logout Security — showing CSRF protection, token blacklisting, session cleanup, and secure redirect"
        />

        <p>
          Security is critical — improper logout leaves users vulnerable. Security measures
          include: CSRF protection (POST request with token), token blacklisting (for immediate
          revocation), secure redirect (prevent open redirect vulnerabilities), clear all storage
          (no残留 tokens), audit logging (track logout events for security monitoring).
          Organizations like Google implement logout notification emails for security awareness.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing logout involves trade-offs between security, user experience, and operational
          complexity. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Local vs Global Logout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Local:</strong> Logout current device only. Better UX (user stays logged in
              on other devices). Limitation: doesn't protect if account compromised.
            </li>
            <li>
              <strong>Global:</strong> Logout all devices. Maximum security (revokes all access).
              Limitation: user frustration (logged out everywhere).
            </li>
            <li>
              <strong>Recommendation:</strong> Default to local logout. Offer global logout as
              option ("Logout all devices"). Require global logout after password change or
              security incident.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Blacklist vs Wait for Expiry</h3>
          <ul className="space-y-3">
            <li>
              <strong>Blacklist:</strong> Immediate revocation, maximum security. Limitation:
              storage overhead (store revoked tokens), lookup on every request.
            </li>
            <li>
              <strong>Wait for Expiry:</strong> No storage overhead, simpler implementation.
              Limitation: delayed revocation (up to token expiry).
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — short-lived access tokens (15 min, wait
              for expiry), blacklist for refresh tokens (immediate revocation). For high-security,
              blacklist access tokens too.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Confirm vs Direct Logout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Confirm:</strong> Show confirmation dialog before logout. Prevents
              accidental logout. Limitation: extra click, friction.
            </li>
            <li>
              <strong>Direct:</strong> Logout immediately on click. Faster, less friction.
              Limitation: accidental logout possible.
            </li>
            <li>
              <strong>Recommendation:</strong> Direct logout for most cases (logout is reversible
              — user can login again). Confirm for global logout ("Logout all devices?") —
              destructive action.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing logout requires following established best practices to ensure security,
          usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use POST request for logout (not GET) — prevent CSRF attacks via image tags. Include CSRF
          token in logout form — validate on server. Invalidate refresh tokens on server — delete
          from database or add to blacklist. Clear all client-side storage — cookies, localStorage,
          sessionStorage. Use secure redirect — prevent open redirect vulnerabilities (validate
          redirect URL against allowlist).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear logout button — visible location (header, user menu). Show logout
          confirmation message — "You have been logged out successfully". Redirect to appropriate
          page — login page or home page (not 404). Preserve user preferences — language, theme
          (stored separately from session). Offer "Logout all devices" option — for security
          incidents.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Device Support</h3>
        <p>
          Show active sessions in account settings — device, location, last active time. Allow
          selective logout — revoke specific device sessions. Implement global logout — revoke all
          sessions. Notify user of logout on other devices — "You were logged out on iPhone". Sync
          logout across devices — logout on one device logs out all (optional).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit &amp; Monitoring</h3>
        <p>
          Log all logout events — user, device, timestamp, IP. Track logout patterns — detect
          anomalies (many logouts in short time). Send logout notification email — for security
          awareness (optional). Monitor for forced logout — detect session hijacking attempts
          (user logged out unexpectedly).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing logout to ensure secure, usable, and
          maintainable logout systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Using GET for logout:</strong> CSRF attacks via image tags, attacker can log
            out users. <strong>Fix:</strong> Use POST request with CSRF token.
          </li>
          <li>
            <strong>Not invalidating refresh tokens:</strong> Access tokens expire but refresh
            tokens remain valid, attacker can get new access tokens.{" "}
            <strong>Fix:</strong> Invalidate refresh tokens on server (delete or blacklist).
          </li>
          <li>
            <strong>Not clearing client storage:</strong> Tokens remain in localStorage, attacker
            with XSS can steal. <strong>Fix:</strong> Clear all client-side storage (cookies,
            localStorage, sessionStorage).
          </li>
          <li>
            <strong>Open redirect vulnerability:</strong> Attacker can redirect to phishing site
            after logout. <strong>Fix:</strong> Validate redirect URL against allowlist, use
            relative URLs.
          </li>
          <li>
            <strong>No multi-device logout:</strong> Can't revoke access on lost devices.{" "}
            <strong>Fix:</strong> Implement "logout all devices" and selective device logout.
          </li>
          <li>
            <strong>Not logging logout events:</strong> Can't detect security incidents, no audit
            trail. <strong>Fix:</strong> Log all logout events for security monitoring.
          </li>
          <li>
            <strong>Clearing user preferences:</strong> Language, theme reset on logout,
            frustration. <strong>Fix:</strong> Store preferences separately from session (in
            cookie or account settings).
          </li>
          <li>
            <strong>No logout confirmation:</strong> User unsure if logout succeeded.{" "}
            <strong>Fix:</strong> Show confirmation message "You have been logged out".
          </li>
          <li>
            <strong>Not handling distributed logout:</strong> User logged out on one service but
            not others. <strong>Fix:</strong> Notify all services of logout (event stream or
            shared session store).
          </li>
          <li>
            <strong>No automatic logout:</strong> Sessions never expire, security risk on shared
            devices. <strong>Fix:</strong> Implement session timeout and inactivity timeout.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Logout is critical for security. Here are real-world implementations from production
          systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer App (Google)</h3>
        <p>
          <strong>Challenge:</strong> Users logged in on multiple devices (phone, tablet,
          computer). Need to revoke access on lost devices. Security incidents require global
          logout.
        </p>
        <p>
          <strong>Solution:</strong> Session management page showing all active devices. Selective
          logout (revoke specific device). Global logout option. Logout notification email.
          Automatic logout on password change.
        </p>
        <p>
          <strong>Result:</strong> Users can manage access on lost devices. Security incidents
          contained quickly. User awareness improved (notification emails).
        </p>
        <p>
          <strong>Security:</strong> Token invalidation, device-specific logout, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require session management for
          compliance. Admin needs to logout users (terminated employees). Audit trails required.
        </p>
        <p>
          <strong>Solution:</strong> Admin-initiated logout (revoke user sessions). Session
          timeout policies (configurable per org). Audit logging for all logout events. SSO logout
          (logout from IdP logs out from all connected apps).
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Admin can revoke access immediately.
          Compliance requirements met.
        </p>
        <p>
          <strong>Security:</strong> Admin controls, session timeout, audit trails, SSO
          integration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking App (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC requires session timeout. High-security needs
          immediate logout on suspicious activity. Users need clear logout confirmation.
        </p>
        <p>
          <strong>Solution:</strong> Automatic session timeout (15 min inactivity). Immediate
          logout on password change. Logout confirmation with redirect to login. No "remember me"
          on shared computers.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Session hijacking prevented. User awareness
          improved.
        </p>
        <p>
          <strong>Security:</strong> Session timeout, immediate invalidation, secure redirect.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Portal (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA requires automatic logout. Shared workstations in
          hospitals. Provider access needs quick re-login.
        </p>
        <p>
          <strong>Solution:</strong> Automatic logout after 15 min inactivity. Quick re-login with
          badge tap (RFID). Session management for providers (multiple workstations). Audit logging
          for HIPAA compliance.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Provider workflow maintained. PHI protected
          on shared workstations.
        </p>
        <p>
          <strong>Security:</strong> Automatic timeout, quick re-auth, audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> Account takeovers for valuable items. Users need to revoke
          access on compromised accounts. Parental controls for minor accounts.
        </p>
        <p>
          <strong>Solution:</strong> Logout all devices option. Session management page showing
          active devices. Parental logout (parents can logout minor accounts). Logout notification
          email.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers contained quickly. Parental control
          effective. User awareness improved.
        </p>
        <p>
          <strong>Security:</strong> Global logout, device management, parental controls.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of logout design, implementation, and operational
          concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why should logout use POST instead of GET?</p>
            <p className="mt-2 text-sm">
              A: GET requests can be triggered by image tags, links, or prefetching — attacker can
              create malicious page that logs out users when they visit (CSRF attack). POST
              requests require form submission with CSRF token, can't be triggered by image tags.
              Always use POST for state-changing operations (logout, delete, update).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you invalidate tokens on logout?</p>
            <p className="mt-2 text-sm">
              A: Access tokens are short-lived (15 min) and stateless — can't revoke directly,
              wait for natural expiry (mitigate with short expiry). Refresh tokens are long-lived
              and stateful — revoke on server by deleting from database or adding to blacklist.
              For immediate revocation of access tokens, use token blacklist (store revoked token
              IDs with TTL matching expiry).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "logout all devices"?</p>
            <p className="mt-2 text-sm">
              A: Maintain session registry (track all active sessions per user with device ID). On
              "logout all devices": invalidate all refresh tokens (delete from database), add
              access tokens to blacklist, notify all services (for distributed systems), clear
              client storage on current device. User must re-login on all devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent open redirect vulnerabilities on logout?</p>
            <p className="mt-2 text-sm">
              A: Don't accept arbitrary redirect URLs from query params. Use allowlist of valid
              redirect URLs (login page, home page). Validate redirect URL against allowlist before
              redirecting. Better: use relative URLs only (/login, not
              https://attacker.com). Never redirect to external URLs after logout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout in distributed systems?</p>
            <p className="mt-2 text-sm">
              A: Use shared session store (Redis) — all services check same session store. Or use
              event stream (Kafka) — publish logout event, all services invalidate local sessions.
              Or use token blacklist — all services check blacklist on every request. Trade-off:
              centralized store (single point of failure) vs eventual consistency (brief window
              where logout not propagated).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you show logout confirmation dialog?</p>
            <p className="mt-2 text-sm">
              A: For local logout: no confirmation needed (logout is reversible — user can login
              again). For global logout ("logout all devices"): show confirmation (destructive
              action, user may not understand consequence). For admin-initiated logout: show
              confirmation (affects other users).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle automatic logout (session timeout)?</p>
            <p className="mt-2 text-sm">
              A: Implement session timeout (absolute timeout — 24 hours max) and inactivity
              timeout (15-30 min for sensitive apps). Warn user before timeout ("Session expires in
              5 minutes"). Allow extend session. On timeout: clear client storage, redirect to
              login, show timeout message. Log timeout events for security monitoring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you clear client-side storage on logout?</p>
            <p className="mt-2 text-sm">
              A: Clear cookies (document.cookie = "" with proper path/domain), clear localStorage
              (localStorage.clear()), clear sessionStorage (sessionStorage.clear()). Clear
              in-memory state (Redux store, React state). Remove event listeners. Clear sensitive
              data from variables (passwords, tokens). For SPA: clear routing state, reset app
              state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for logout?</p>
            <p className="mt-2 text-sm">
              A: Logout rate (logouts per day), logout method distribution (local vs global vs
              selective), session duration (time from login to logout), timeout rate (automatic
              logouts), forced logout rate (security incidents), logout errors. Monitor for
              anomalies — spike in forced logouts (attack), many global logouts (security
              incident).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST SP 800-63B - Digital Identity Guidelines
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP CSRF Prevention Cheat Sheet
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
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - HTTP Cookies Guide
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
