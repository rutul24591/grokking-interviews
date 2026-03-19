"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-session-persistence",
  title: "Session Persistence",
  description: "Comprehensive guide to implementing session persistence covering token storage, refresh strategies, remember me functionality, cross-tab sync, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "session-persistence",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "session", "persistence", "tokens", "frontend"],
  relatedTopics: ["login-interface", "logout", "token-generation", "authentication-service"],
};

export default function SessionPersistenceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Session Persistence</strong> refers to maintaining user authentication 
          state across page reloads, browser restarts, and extended periods. It enables 
          "remember me" functionality, seamless navigation, and multi-session support 
          while balancing convenience with security.
        </p>
        <p>
          For staff and principal engineers, implementing session persistence requires 
          understanding token storage strategies, refresh mechanisms, security trade-offs 
          (XSS, CSRF), cross-tab synchronization, and session lifecycle management. The 
          implementation must provide seamless UX while protecting against token theft 
          and unauthorized access.
        </p>
      </section>

      <section>
        <h2>Token Storage Strategies</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">HttpOnly Cookies (Recommended)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Storage:</strong> Refresh token in HttpOnly, Secure, SameSite cookie. 
              Inaccessible to JavaScript (XSS-proof).
            </li>
            <li>
              <strong>Access Token:</strong> In memory or short-lived cookie. Not in 
              localStorage.
            </li>
            <li>
              <strong>Security:</strong> Prevents XSS token theft. CSRF protection via 
              SameSite attribute.
            </li>
            <li>
              <strong>Expiry:</strong> Long-lived (7-30 days) for "remember me".
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">LocalStorage (Not Recommended)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Storage:</strong> Both tokens in localStorage. Accessible via 
              JavaScript.
            </li>
            <li>
              <strong>Risk:</strong> XSS vulnerability—any script can read tokens. 
              Avoid for sensitive apps.
            </li>
            <li>
              <strong>Use Case:</strong> Low-security apps, internal tools. Never for 
              financial/healthcare.
            </li>
            <li>
              <strong>Mitigation:</strong> Short token expiry, CSP headers, XSS 
              protection.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SessionStorage</h3>
          <ul className="space-y-3">
            <li>
              <strong>Storage:</strong> Tokens cleared on tab close. Per-tab storage.
            </li>
            <li>
              <strong>Use Case:</strong> "Don't remember me" option, sensitive 
              operations, shared computers.
            </li>
            <li>
              <strong>Security:</strong> Same XSS risk as localStorage, but auto-clears.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">In-Memory Only</h3>
          <ul className="space-y-3">
            <li>
              <strong>Storage:</strong> Tokens in JavaScript variables. Lost on 
              refresh.
            </li>
            <li>
              <strong>Use Case:</strong> High-security apps, admin panels, combined 
              with re-authentication.
            </li>
            <li>
              <strong>UX:</strong> User must re-login on every refresh. Not practical 
              for most apps.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Token Refresh Strategy</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Silent Refresh</h3>
          <ul className="space-y-3">
            <li>
              <strong>Timing:</strong> Refresh access token before expiry (e.g., at 
              80% of TTL).
            </li>
            <li>
              <strong>Mechanism:</strong> Automatic API call to /refresh endpoint. 
              Use refresh token cookie.
            </li>
            <li>
              <strong>Failure:</strong> If refresh fails, redirect to login. Clear 
              local state.
            </li>
            <li>
              <strong>Queue Requests:</strong> During refresh, queue API calls. 
              Retry after refresh completes.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Refresh Token Rotation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Issue new refresh token on each use. 
              Invalidate old token.
            </li>
            <li>
              <strong>Security:</strong> Detects token theft (if old token used, 
              revoke all sessions).
            </li>
            <li>
              <strong>Implementation:</strong> Server returns new refresh token 
              with access token. Update cookie.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cross-Tab Synchronization</h2>
        <ul className="space-y-3">
          <li>
            <strong>BroadcastChannel:</strong> Broadcast auth state changes to all 
            tabs. All tabs login/logout together.
          </li>
          <li>
            <strong>localStorage Event:</strong> Fallback for older browsers. Listen 
            for storage events.
          </li>
          <li>
            <strong>Shared State:</strong> Store auth state in localStorage (not 
            tokens). Sync across tabs.
          </li>
          <li>
            <strong>Logout Sync:</strong> When one tab logs out, all tabs clear 
            state and redirect to login.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>XSS Protection:</strong> Use HttpOnly cookies, CSP headers, 
            sanitize user input.
          </li>
          <li>
            <strong>CSRF Protection:</strong> SameSite cookies, CSRF tokens for 
            state-changing requests.
          </li>
          <li>
            <strong>Token Expiry:</strong> Short access token (15-60 min), longer 
            refresh token (7-30 days).
          </li>
          <li>
            <strong>Secure Context:</strong> HTTPS only, Secure cookie flag, HSTS 
            headers.
          </li>
          <li>
            <strong>Device Trust:</strong> Remember trusted devices, require MFA 
            on new devices.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where should you store JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: Access token in memory (not localStorage), refresh token in HttpOnly 
              cookie. This prevents XSS theft of refresh token. Short access token 
              expiry limits damage if stolen.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "remember me"?</p>
            <p className="mt-2 text-sm">
              A: Long-lived refresh token (30 days) in HttpOnly cookie. Access token 
              short-lived (15 min). Silent refresh before access token expires. Allow 
              user to revoke sessions from settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token expiry during user activity?</p>
            <p className="mt-2 text-sm">
              A: Silent refresh at 80% of TTL. Queue API calls during refresh. If 
              refresh fails, show login modal (preserve user work). Auto-retry after 
              re-authentication.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync logout across tabs?</p>
            <p className="mt-2 text-sm">
              A: BroadcastChannel API to broadcast logout event. All tabs listen and 
              clear state. Fallback: localStorage event. Server: invalidate session, 
              all tabs detect on next API call (401).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store tokens in Redux/Zustand?</p>
            <p className="mt-2 text-sm">
              A: Access token yes (in memory state), refresh token no (use HttpOnly 
              cookie). State management for access token enables easy API integration. 
              Refresh token should never be in JavaScript-accessible storage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session hijacking?</p>
            <p className="mt-2 text-sm">
              A: Token binding to device fingerprint, refresh token rotation (detect 
              reuse), short access token expiry, monitor for unusual activity (location 
              changes), allow users to see/revoke sessions.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
