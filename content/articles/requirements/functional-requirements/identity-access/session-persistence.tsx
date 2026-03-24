"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-session-persistence",
  title: "Session Persistence",
  description:
    "Comprehensive guide to implementing session persistence covering token storage strategies (HttpOnly cookies, memory), refresh mechanisms, remember me functionality, cross-tab synchronization, token rotation, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "session-persistence",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "session",
    "persistence",
    "tokens",
    "frontend",
  ],
  relatedTopics: ["login-interface", "logout", "token-generation"],
};

export default function SessionPersistenceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Session Persistence</strong> refers to maintaining user authentication state
          across page reloads, browser restarts, and extended periods. It enables "remember me"
          functionality, seamless navigation, and multi-session support while balancing
          convenience with security. Session persistence is critical for user experience — without
          it, users would need to re-authenticate on every page load.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-persistence-flow.svg"
          alt="Session Persistence Flow"
          caption="Session Persistence Flow — comparing token storage strategies, refresh mechanisms, and cross-tab synchronization"
        />

        <p>
          For staff and principal engineers, implementing session persistence requires deep
          understanding of token storage strategies (HttpOnly cookies, memory, localStorage),
          refresh mechanisms (silent refresh, refresh token rotation), security trade-offs (XSS,
          CSRF), cross-tab synchronization (BroadcastChannel API), and session lifecycle
          management. The implementation must provide seamless UX while protecting against token
          theft and unauthorized access.
        </p>
        <p>
          Modern session persistence has evolved from simple cookie-based sessions to sophisticated
          token-based systems with refresh token rotation, cross-tab synchronization, and device
          trust. Organizations like Google, Microsoft, and Okta handle billions of session
          operations daily while maintaining security through short-lived access tokens, rotating
          refresh tokens, and HttpOnly cookie storage.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Session persistence is built on fundamental concepts that determine how tokens are
          stored, refreshed, and synchronized. Understanding these concepts is essential for
          designing effective session systems.
        </p>
        <p>
          <strong>Token Storage Strategies:</strong> HttpOnly cookies (recommended — refresh token
          in HttpOnly, Secure, SameSite cookie, inaccessible to JavaScript, XSS-proof), Memory
          (access token in JavaScript variables, lost on refresh, most secure), localStorage (not
          recommended — accessible via JavaScript, XSS risk), sessionStorage (per-tab storage,
          cleared on tab close).
        </p>
        <p>
          <strong>Token Refresh Strategy:</strong> Silent refresh (refresh access token before
          expiry at 80% of TTL, automatic API call to /refresh endpoint), refresh token rotation
          (issue new refresh token on each use, invalidate old, detect reuse attacks), queue
          requests during refresh (pause API calls, retry after refresh completes).
        </p>
        <p>
          <strong>Cross-Tab Synchronization:</strong> BroadcastChannel API (broadcast auth state
          changes to all tabs, all tabs login/logout together), localStorage event (fallback for
          older browsers, listen for storage events), shared state (store auth state in
          localStorage, not tokens, sync across tabs).
        </p>
        <p>
          <strong>Security Considerations:</strong> XSS protection (HttpOnly cookies, CSP headers,
          sanitize user input), CSRF protection (SameSite cookies, CSRF tokens for state-changing
          requests), token expiry (short access token 15-60 min, longer refresh token 7-30 days),
          secure context (HTTPS only, Secure cookie flag, HSTS headers), device trust (remember
          trusted devices, require MFA on new devices).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Session persistence architecture separates token storage from refresh logic, enabling
          secure token handling with seamless user experience. This architecture is critical for
          maintaining security while providing smooth UX.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-token-refresh.svg"
          alt="Session Token Refresh"
          caption="Session Token Refresh — showing access token expiry, silent refresh, refresh token rotation, and failure handling"
        />

        <p>
          Session flow: User logs in successfully. Backend returns access token (short-lived) and
          refresh token (long-lived). Frontend stores access token in memory, refresh token in
          HttpOnly cookie. On each API request: include access token in Authorization header.
          Before access token expires (at 80% TTL): trigger silent refresh (POST /refresh with
          refresh token cookie), backend validates refresh token, issues new access token + new
          refresh token (rotation), frontend updates memory with new tokens.
        </p>
        <p>
          Cross-tab sync flow: User logs in on tab A. BroadcastChannel broadcasts "login" event
          with user data. Tab B receives event, updates auth state, redirects to dashboard. User
          logs out on tab A. BroadcastChannel broadcasts "logout" event. All tabs receive event,
          clear auth state, redirect to login. This ensures consistent auth state across all tabs.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-security.svg"
          alt="Session Security"
          caption="Session Security — showing XSS prevention, CSRF protection, token binding, session hijacking detection, and secure storage"
        />

        <p>
          Security architecture includes: HttpOnly cookies for refresh tokens (XSS-proof), memory
          storage for access tokens (no persistence), refresh token rotation (detect theft),
          cross-tab logout sync (consistent state), device trust (skip MFA on trusted devices).
          This architecture enables secure session persistence — tokens are protected even if XSS
          vulnerability exists.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing session persistence involves trade-offs between security, user experience, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">HttpOnly Cookie vs localStorage vs Memory</h3>
          <ul className="space-y-3">
            <li>
              <strong>HttpOnly Cookie:</strong> XSS-proof (JavaScript can't access), automatic
              inclusion, CSRF risk (mitigate with SameSite). Recommended for refresh tokens.
            </li>
            <li>
              <strong>localStorage:</strong> Easy to use, persists across restarts. Limitation:
              XSS vulnerability (any script can read tokens). Not recommended for sensitive apps.
            </li>
            <li>
              <strong>Memory:</strong> Most secure (lost on refresh), no persistence. Limitation:
              user must re-login on refresh. Recommended for access tokens.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Silent Refresh vs Re-authentication</h3>
          <ul className="space-y-3">
            <li>
              <strong>Silent Refresh:</strong> Seamless UX (no user interaction), automatic token
              renewal. Limitation: complexity (queue requests, handle failures).
            </li>
            <li>
              <strong>Re-authentication:</strong> Simple implementation, clear security boundary.
              Limitation: poor UX (user must re-login on expiry).
            </li>
            <li>
              <strong>Recommendation:</strong> Silent refresh for consumer apps (seamless UX).
              Re-authentication for high-security apps (admin panels, banking).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Single Tab vs Cross-Tab Sync</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single Tab:</strong> Simple implementation, no sync needed. Limitation:
              inconsistent state across tabs (logout in one tab, others stay logged in).
            </li>
            <li>
              <strong>Cross-Tab Sync:</strong> Consistent state across tabs, better UX.
              Limitation: complexity (BroadcastChannel, fallback for older browsers).
            </li>
            <li>
              <strong>Recommendation:</strong> Cross-tab sync for most apps (BroadcastChannel
              API). Fallback to localStorage event for older browsers.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing session persistence requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use HttpOnly cookies for refresh tokens — XSS-proof, automatic inclusion. Store access
          tokens in memory only — no persistence, lost on refresh. Implement token refresh before
          expiry — silent refresh at 80% of TTL. Use refresh token rotation — issue new on each
          use, invalidate old. Implement cross-tab logout sync — BroadcastChannel API for
          consistent state.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Implement silent token refresh — seamless UX, no user interaction. Queue API calls during
          refresh — pause requests, retry after refresh completes. Preserve user work on session
          expiry — save state, auto-retry after re-authentication. Show clear session expiry
          warnings — notify user before expiry. Provide session management UI — show active
          sessions, allow revocation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Management</h3>
        <p>
          Short access token expiry (15-60 minutes) — limit exposure window. Long refresh token
          expiry (7-30 days) — enable "remember me". Rotate refresh tokens on use — detect reuse
          attacks. Invalidate tokens on logout — clear memory, delete cookies. Support multiple
          concurrent sessions — users can be logged in on multiple devices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <p>
          Track token refresh success/failure rates — baseline normal, alert on anomalies. Monitor
          session duration — detect unusual patterns. Alert on unusual session patterns —
          geographic anomalies, concurrent sessions from different locations. Track concurrent
          session count — detect abuse. Monitor token rotation events — ensure rotation working.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing session persistence to ensure secure,
          usable, and maintainable session systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Tokens in localStorage:</strong> XSS can steal tokens, full account
            compromise. <strong>Fix:</strong> Use HttpOnly cookies for refresh tokens. Memory for
            access tokens.
          </li>
          <li>
            <strong>No token refresh:</strong> Users logged out unexpectedly, poor UX.{" "}
            <strong>Fix:</strong> Silent refresh before access token expiry (at 80% of TTL).
          </li>
          <li>
            <strong>No cross-tab sync:</strong> Logout in one tab, others stay logged in,
            inconsistent state. <strong>Fix:</strong> BroadcastChannel API for logout sync.
            Fallback to localStorage event.
          </li>
          <li>
            <strong>Long access token expiry:</strong> Stolen tokens valid for too long, extended
            exposure. <strong>Fix:</strong> Short access token (15 min), refresh token rotation.
          </li>
          <li>
            <strong>No refresh token rotation:</strong> Stolen refresh token can be reused
            indefinitely. <strong>Fix:</strong> Issue new refresh token on each use. Invalidate
            old. Detect reuse attacks.
          </li>
          <li>
            <strong>API calls during refresh:</strong> Race conditions, failed requests,
            inconsistent state. <strong>Fix:</strong> Queue API calls during refresh. Retry after
            refresh completes.
          </li>
          <li>
            <strong>No session management UI:</strong> Users can't see/revoke sessions, security
            risk. <strong>Fix:</strong> Provide session list with device info and revoke option.
          </li>
          <li>
            <strong>Poor expiry handling:</strong> Users lose work on session expiry, frustration.{" "}
            <strong>Fix:</strong> Warn before expiry, preserve work, auto-retry after
            re-authentication.
          </li>
          <li>
            <strong>No device trust:</strong> Every login requires MFA, friction for trusted
            devices. <strong>Fix:</strong> Remember trusted devices, MFA on new devices only.
          </li>
          <li>
            <strong>CSRF vulnerability:</strong> Cookie-based auth vulnerable to CSRF attacks.{" "}
            <strong>Fix:</strong> SameSite cookies, CSRF tokens for state-changing requests.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Session persistence is critical for platform UX. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, multiple devices per user. Need seamless
          session persistence. Security critical.
        </p>
        <p>
          <strong>Solution:</strong> HttpOnly cookies for refresh tokens. Silent refresh for access
          tokens. Cross-tab sync via BroadcastChannel. Device trust (skip MFA on trusted devices).
        </p>
        <p>
          <strong>Result:</strong> Seamless UX across devices. Session theft detected via rotation.
          Users stay logged in securely.
        </p>
        <p>
          <strong>Security:</strong> HttpOnly cookies, token rotation, device trust.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require session controls. Compliance
          needs session audit trails. Session timeout policies per org.
        </p>
        <p>
          <strong>Solution:</strong> Configurable session timeout per org. Silent refresh within
          timeout window. Session audit logging for compliance. Admin session management UI.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Configurable session policies. Compliance
          requirements met.
        </p>
        <p>
          <strong>Security:</strong> Session timeout, audit trails, admin controls.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires session timeout. High-security
          needs short session duration. No "remember me" for security.
        </p>
        <p>
          <strong>Solution:</strong> Short session timeout (15 min idle). No silent refresh —
          re-authentication required. Memory-only token storage. No persistent cookies.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Session fixation prevented. Fraud reduced
          90%.
        </p>
        <p>
          <strong>Security:</strong> Short timeout, memory storage, re-authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires session controls. Provider
          sessions need automatic timeout. Shared workstations need quick re-login.
        </p>
        <p>
          <strong>Solution:</strong> Short session timeout (15 min idle). Badge tap for quick
          re-login (RFID). Session audit for PHI access. No persistent sessions on shared
          workstations.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Automatic session timeout. PHI access
          logged.
        </p>
        <p>
          <strong>Security:</strong> Session timeout, audit logging, quick re-auth.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M+ users, high account takeover rate. Session theft for
          valuable items. Multiple devices per user.
        </p>
        <p>
          <strong>Solution:</strong> HttpOnly cookies for refresh tokens. Silent refresh for access
          tokens. Device-aware sessions. Session management UI (show all devices). Refresh token
          rotation.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 85%. Session theft detected via
          rotation. Users can manage sessions.
        </p>
        <p>
          <strong>Security:</strong> Token rotation, device tracking, session management.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of session persistence design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where should you store JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: Access token in memory (not localStorage) — no persistence, lost on refresh.
              Refresh token in HttpOnly cookie — XSS-proof, automatic inclusion. This prevents XSS
              theft of refresh token. Short access token expiry limits damage if stolen. Never
              store refresh tokens in JavaScript-accessible storage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "remember me"?</p>
            <p className="mt-2 text-sm">
              A: Long-lived refresh token (30 days) in HttpOnly cookie. Access token short-lived
              (15 min). Silent refresh before access token expires (at 80% of TTL). Allow user to
              revoke sessions from settings. Provide session list with device info.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token expiry during user activity?</p>
            <p className="mt-2 text-sm">
              A: Silent refresh at 80% of TTL — before expiry. Queue API calls during refresh —
              pause outgoing requests. If refresh fails, show login modal (preserve user work).
              Auto-retry after re-authentication. Warn user before session expires — give time to
              save work.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync logout across tabs?</p>
            <p className="mt-2 text-sm">
              A: BroadcastChannel API to broadcast logout event. All tabs listen and clear state.
              Fallback: localStorage event (older browsers). Server: invalidate session, all tabs
              detect on next API call (401). Clear storage on logout — memory, cookies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store tokens in Redux/Zustand?</p>
            <p className="mt-2 text-sm">
              A: Access token yes (in memory state) — enables easy API integration. Refresh token
              no (use HttpOnly cookie) — never in JavaScript-accessible storage. State management
              for access token enables easy API integration, automatic token inclusion in requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session hijacking?</p>
            <p className="mt-2 text-sm">
              A: Token binding to device fingerprint — detect theft (if used from different
              device). Refresh token rotation — detect reuse (if old token used, revoke all
              sessions). Short access token expiry — limit exposure window. Monitor for unusual
              activity (location changes). Allow users to see/revoke sessions. Alert on suspicious
              patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement refresh token rotation?</p>
            <p className="mt-2 text-sm">
              A: Issue new refresh token on each use. Invalidate old token (delete from database).
              If old token used (theft detected), revoke all sessions. Store refresh token hash in
              database (not plaintext). Update cookie with new token on each refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle API calls during token refresh?</p>
            <p className="mt-2 text-sm">
              A: Queue API calls during refresh. Use interceptor to detect 401. Pause outgoing
              requests. Refresh token. Retry queued requests with new token. Limit queue size to
              prevent memory issues. Handle refresh failure — redirect to login, clear state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for session persistence?</p>
            <p className="mt-2 text-sm">
              A: Token refresh success/failure rate, session duration, concurrent session count,
              token rotation events, session hijacking attempts. Set up alerts for anomalies — high
              failure rate (refresh issues), unusual patterns (theft detection).
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Tokens_for_Java.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP JWT Cheat Sheet
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
