"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-oauth-integration",
  title: "OAuth Integration",
  description: "Staff-level OAuth integration for modern SPAs: authorization flows (Authorization Code with PKCE), token lifetimes, threat models, secure storage, and operational guardrails for identity at scale.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "oauth-integration",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "oauth", "security", "identity", "pkce", "reliability", "spa", "authentication"],
  relatedTopics: ["payment-gateway-integration", "widget-embedding", "script-loading-strategies", "security-authentication"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>OAuth</strong> is an authorization framework used to grant a client application scoped access to protected resources without sharing user credentials directly. In modern frontend systems, OAuth is often paired with OpenID Connect (OIDC) for authentication, and it is typically delivered via a third-party identity provider (IdP) such as Auth0, Okta, AWS Cognito, Google, or GitHub.
        </p>
        <p>
          OAuth integration is not "just login." It is a <strong>cross-cutting system design problem</strong> that touches: security posture (token theft, redirect manipulation), user experience (redirects, session continuity), scale (multi-tenant configuration, key rotation), and reliability (IdP outages and latency). The frontend is in the blast radius because it owns redirects, handles tokens, and mediates user identity state.
        </p>
        <p>
          For staff/principal engineers, the goal is to design an integration that balances security, UX, and operational complexity. Key decisions include:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Flow Selection:</strong> Authorization Code with PKCE (recommended for SPAs), Implicit Flow (deprecated), or Device Flow (for limited input devices).
          </li>
          <li>
            <strong>Token Storage:</strong> httpOnly cookies (recommended), memory (acceptable with refresh tokens), or localStorage (not recommended due to XSS risk).
          </li>
          <li>
            <strong>Token Lifetime:</strong> Short-lived access tokens (5-60 minutes) with refresh tokens for session continuity.
          </li>
          <li>
            <strong>Threat Mitigation:</strong> PKCE for public clients, state parameter for CSRF, strict redirect URI validation.
          </li>
        </ul>
        <p>
          The business impact of OAuth integration decisions is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Poor OAuth implementation can lead to account takeover, token theft, or unauthorized access. OAuth misconfigurations are a top-10 vulnerability in web applications.
          </li>
          <li>
            <strong>User Experience:</strong> Complex login flows increase abandonment. Every extra redirect or form field reduces conversion. Social login can increase sign-up rates by 20-50%.
          </li>
          <li>
            <strong>Compliance:</strong> OAuth implementations must comply with regulations (GDPR, CCPA, PSD2/SCA for payments). Non-compliance can result in fines and legal liability.
          </li>
          <li>
            <strong>Operational Risk:</strong> IdP outages can block all user access. You need fallback strategies and monitoring.
          </li>
        </ul>
        <p>
          In system design interviews, OAuth integration demonstrates understanding of security protocols, threat modeling, token-based authentication, and the trade-offs between security and UX. It shows you can design authentication systems that are both secure and usable.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/oauth-flow.svg"
          alt="OAuth 2.0 Authorization Code Flow with PKCE showing browser, authorization server, and backend API with step-by-step flow"
          caption="OAuth 2.0 Authorization Code Flow with PKCE — secure flow for SPAs where code_verifier prevents code interception attacks"
        />

        <h3>OAuth 2.0 Flows</h3>
        <p>
          OAuth defines several authorization flows, each suited for different client types:
        </p>

        <h4>Flow 1: Authorization Code with PKCE (Recommended for SPAs)</h4>
        <p>
          This is the current best practice for single-page applications. PKCE (Proof Key for Code Exchange) adds an extra layer of security by preventing authorization code interception attacks.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Step 1:</strong> Client generates code_verifier (random string) and derives code_challenge = SHA256(code_verifier).
          </li>
          <li>
            <strong>Step 2:</strong> Redirect user to IdP with code_challenge and redirect_uri.
          </li>
          <li>
            <strong>Step 3:</strong> User authenticates with IdP.
          </li>
          <li>
            <strong>Step 4:</strong> IdP redirects back with authorization_code.
          </li>
          <li>
            <strong>Step 5:</strong> Client sends code + code_verifier to IdP token endpoint.
          </li>
          <li>
            <strong>Step 6:</strong> IdP verifies code_challenge matches code_verifier, returns tokens.
          </li>
        </ul>
        <p>
          PKCE prevents attacks where an attacker intercepts the authorization code: even with the code, the attacker cannot exchange it for tokens without the code_verifier.
        </p>

        <h4>Flow 2: Implicit Flow (Deprecated)</h4>
        <p>
          The Implicit Flow returned tokens directly in the redirect URL fragment. It was deprecated because:
        </p>
        <ul className="space-y-2">
          <li>
            Tokens in URL can be leaked via referer headers, browser history, and server logs.
          </li>
          <li>
            No refresh tokens, requiring frequent re-authentication.
          </li>
          <li>
            No PKCE protection against code interception.
          </li>
        </ul>
        <p>
          <strong>Never use Implicit Flow for new implementations.</strong> Use Authorization Code with PKCE instead.
        </p>

        <h4>Flow 3: Device Flow (Limited Input Devices)</h4>
        <p>
          For devices with limited input capability (TVs, IoT devices, CLI tools):
        </p>
        <ul className="space-y-2">
          <li>
            Device requests device_code and user_code from IdP.
          </li>
          <li>
            User visits verification URL on another device and enters user_code.
          </li>
          <li>
            Device polls IdP until user completes authorization.
          </li>
        </ul>
        <p>
          Device Flow is not typically used for web SPAs but is important for multi-device ecosystems.
        </p>

        <h3>Token Types and Lifetimes</h3>
        <p>
          OAuth uses several token types, each with different purposes and lifetimes:
        </p>

        <h4>Access Token</h4>
        <ul className="space-y-2">
          <li>
            <strong>Purpose:</strong> Used to access protected resources (API calls).
          </li>
          <li>
            <strong>Lifetime:</strong> Short-lived (5-60 minutes). Limits damage if stolen.
          </li>
          <li>
            <strong>Format:</strong> Often JWT (contains claims) or opaque (requires introspection).
          </li>
          <li>
            <strong>Storage:</strong> Memory or httpOnly cookie. Never localStorage.
          </li>
        </ul>

        <h4>Refresh Token</h4>
        <ul className="space-y-2">
          <li>
            <strong>Purpose:</strong> Used to obtain new access tokens without re-authentication.
          </li>
          <li>
            <strong>Lifetime:</strong> Long-lived (days to months). Enables persistent sessions.
          </li>
          <li>
            <strong>Security:</strong> Must be stored securely. Rotation recommended (new refresh token issued with each use).
          </li>
          <li>
            <strong>Storage:</strong> httpOnly cookie (recommended) or secure backend storage.
          </li>
        </ul>

        <h4>ID Token (OIDC)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Purpose:</strong> Contains user identity information (name, email, picture).
          </li>
          <li>
            <strong>Format:</strong> Always JWT.
          </li>
          <li>
            <strong>Usage:</strong> Display user info, not for API authorization.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/token-lifecycle.svg"
          alt="Token lifecycle diagram showing access token usage, expiration, refresh token exchange, and new token pair issuance"
          caption="Token lifecycle — access tokens expire quickly; refresh tokens enable silent renewal; rotate refresh tokens for security"
        />

        <h3>Token Storage Strategies</h3>
        <p>
          Where you store tokens is a critical security decision:
        </p>

        <h4>Strategy 1: httpOnly Cookies (Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> JavaScript cannot access cookies, protecting against XSS token theft.
          </li>
          <li>
            <strong>CSRF Protection:</strong> Use SameSite=Strict and CSRF tokens for state-changing operations.
          </li>
          <li>
            <strong>Automatic:</strong> Cookies sent automatically with requests (can be pro or con).
          </li>
          <li>
            <strong>Backend Required:</strong> Need backend to set cookies from token response.
          </li>
        </ul>

        <h4>Strategy 2: Memory (Acceptable with Refresh Tokens)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Tokens cleared on page refresh. XSS can still steal tokens while page is loaded.
          </li>
          <li>
            <strong>UX Impact:</strong> Page refresh requires silent re-authentication via refresh token.
          </li>
          <li>
            <strong>Simplicity:</strong> No backend required for cookie handling.
          </li>
        </ul>

        <h4>Strategy 3: localStorage (Not Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Vulnerable to XSS. Any script can read localStorage.
          </li>
          <li>
            <strong>Persistence:</strong> Tokens survive page refresh (but so do attackers).
          </li>
          <li>
            <strong>Convenience:</strong> Easy to implement, no backend required.
          </li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Use httpOnly cookies for access tokens. If that's not feasible, use memory with refresh tokens. Never use localStorage for tokens.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/token-storage-comparison.svg"
          alt="Token storage comparison showing localStorage (HIGH RISK), httpOnly cookie (LOW RISK), and memory (MEDIUM RISK) with pros and cons"
          caption="Token storage comparison — httpOnly cookies protect against XSS; localStorage is vulnerable to any XSS vulnerability"
        />

        <h3>Security Threats and Mitigations</h3>
        <p>
          OAuth implementations face several attack vectors:
        </p>

        <h4>Threat 1: Authorization Code Interception</h4>
        <ul className="space-y-2">
          <li>
            <strong>Attack:</strong> Attacker intercepts authorization code during redirect (e.g., via compromised WiFi, malicious browser extension).
          </li>
          <li>
            <strong>Mitigation:</strong> PKCE. Even with intercepted code, attacker cannot exchange it without code_verifier.
          </li>
        </ul>

        <h4>Threat 2: CSRF on Redirect URI</h4>
        <ul className="space-y-2">
          <li>
            <strong>Attack:</strong> Attacker initiates OAuth flow from their site, user authenticates, attacker's account is linked to victim's session.
          </li>
          <li>
            <strong>Mitigation:</strong> State parameter. Generate random state before redirect, verify it matches on callback.
          </li>
        </ul>

        <h4>Threat 3: Token Theft via XSS</h4>
        <ul className="space-y-2">
          <li>
            <strong>Attack:</strong> XSS vulnerability allows attacker to steal tokens from localStorage or memory.
          </li>
          <li>
            <strong>Mitigation:</strong> httpOnly cookies (JavaScript cannot access), short token lifetimes, CSP to prevent XSS.
          </li>
        </ul>

        <h4>Threat 4: Redirect URI Manipulation</h4>
        <ul className="space-y-2">
          <li>
            <strong>Attack:</strong> Attacker modifies redirect_uri to send code to their server.
          </li>
          <li>
            <strong>Mitigation:</strong> IdP validates redirect_uri against pre-registered whitelist. Never allow wildcards.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/oauth-threat-model.svg"
          alt="OAuth security threat model showing attack vectors (code interception, token theft, CSRF, redirect manipulation) and defense layers (PKCE, httpOnly cookies, state parameter, redirect validation)"
          caption="OAuth threat model — defense in depth with PKCE, state parameter, httpOnly cookies, and redirect URI validation"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust OAuth architecture treats authentication as a <strong>cross-cutting concern</strong> that affects routing, API calls, error handling, and user experience.
        </p>

        <h3>Authentication Flow Architecture</h3>
        <p>
          The complete authentication flow involves multiple components:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Auth Guard:</strong> Route protection that checks authentication state and redirects to login if needed.
          </li>
          <li>
            <strong>Token Manager:</strong> Handles token storage, refresh, and expiration checking.
          </li>
          <li>
            <strong>API Interceptor:</strong> Automatically attaches access token to API requests. Handles 401 responses by triggering refresh.
          </li>
          <li>
            <strong>Session Manager:</strong> Manages user session state, logout, and multi-tab synchronization.
          </li>
        </ul>

        <h3>Silent Authentication</h3>
        <p>
          When access tokens expire, you need to renew the session without user interaction:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Refresh Token Flow:</strong> Use refresh token to obtain new access token. Happens in background.
          </li>
          <li>
            <strong>Hidden Iframe (Legacy):</strong> Load IdP login page in hidden iframe. IdP session cookie authenticates silently. (Less reliable with ITP and cookie restrictions.)
          </li>
          <li>
            <strong>Check Session Endpoint:</strong> Poll IdP's check_session endpoint to detect if user is still logged in at IdP.
          </li>
        </ul>
        <p>
          Refresh token flow is the modern recommended approach. Hidden iframe is becoming unreliable due to browser privacy features (ITP, cookie restrictions).
        </p>

        <h3>Multi-Tab Synchronization</h3>
        <p>
          Users often have multiple tabs open. Authentication state must be synchronized:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Storage Events:</strong> Listen for storage events to detect login/logout in other tabs.
          </li>
          <li>
            <strong>BroadcastChannel:</strong> Use BroadcastChannel API for cross-tab communication.
          </li>
          <li>
            <strong>Shared Token Storage:</strong> Store tokens in shared location (localStorage or cookie) accessible by all tabs.
          </li>
          <li>
            <strong>Logout Propagation:</strong> When user logs out in one tab, propagate logout to all tabs.
          </li>
        </ul>

        <h3>Error Handling</h3>
        <p>
          OAuth flows can fail in multiple ways. Handle each appropriately:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>401 Unauthorized:</strong> Access token expired or invalid. Trigger refresh flow.
          </li>
          <li>
            <strong>403 Forbidden:</strong> User lacks permission. Show access denied message.
          </li>
          <li>
            <strong>Refresh Token Expired:</strong> User must re-authenticate. Redirect to login.
          </li>
          <li>
            <strong>IdP Unavailable:</strong> Show graceful error message. Retry with backoff.
          </li>
          <li>
            <strong>Network Error:</strong> Retry with exponential backoff. Show offline indicator.
          </li>
        </ul>

        <h3>Backend-for-Frontend (BFF) Pattern</h3>
        <p>
          For maximum security, use the BFF pattern:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Architecture:</strong> Frontend communicates with backend (BFF), backend communicates with IdP and APIs.
          </li>
          <li>
            <strong>Token Storage:</strong> Tokens stored in httpOnly cookies on backend, never exposed to frontend.
          </li>
          <li>
            <strong>Security:</strong> Frontend cannot access tokens, eliminating XSS token theft risk.
          </li>
          <li>
            <strong>Complexity:</strong> Requires backend infrastructure. More complex than pure frontend auth.
          </li>
        </ul>
        <p>
          BFF is recommended for high-security applications (financial, healthcare, enterprise). For lower-risk applications, frontend-only OAuth with httpOnly cookies is acceptable.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          OAuth implementation involves trade-offs between security, UX, and complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Security</th>
              <th className="p-3 text-left">UX</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">BFF Pattern</td>
              <td className="p-3">Best (tokens never exposed)</td>
              <td className="p-3">Good (silent refresh)</td>
              <td className="p-3">High (backend required)</td>
              <td className="p-3">High-security apps</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">httpOnly Cookies</td>
              <td className="p-3">Good (XSS protected)</td>
              <td className="p-3">Good (automatic)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Most SPAs</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Memory + Refresh</td>
              <td className="p-3">Medium (XSS vulnerable)</td>
              <td className="p-3">Fair (refresh on reload)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Lower-risk apps</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">localStorage</td>
              <td className="p-3">Poor (XSS steals tokens)</td>
              <td className="p-3">Best (persistent)</td>
              <td className="p-3">Lowest</td>
              <td className="p-3">Not recommended</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that <strong>security should drive the decision</strong>. For high-risk applications (financial, healthcare, enterprise), invest in BFF or httpOnly cookies. For lower-risk applications (content sites, portfolios), memory + refresh may be acceptable.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Authorization Code with PKCE:</strong> Never use Implicit Flow. PKCE is required for public clients (SPAs).
          </li>
          <li>
            <strong>Store Tokens Securely:</strong> httpOnly cookies preferred. Memory acceptable. Never localStorage.
          </li>
          <li>
            <strong>Short Access Token Lifetime:</strong> 5-60 minutes maximum. Limits damage if token is stolen.
          </li>
          <li>
            <strong>Refresh Token Rotation:</strong> Issue new refresh token with each use. Detect reuse (indicates theft).
          </li>
          <li>
            <strong>Validate State Parameter:</strong> Always generate and verify state parameter to prevent CSRF.
          </li>
          <li>
            <strong>Strict Redirect URI:</strong> Register exact redirect URIs with IdP. No wildcards.
          </li>
          <li>
            <strong>Implement Silent Refresh:</strong> Use refresh tokens for seamless session renewal without user interaction.
          </li>
          <li>
            <strong>Handle IdP Outages:</strong> Implement retry logic with backoff. Show graceful error messages.
          </li>
          <li>
            <strong>Multi-Tab Sync:</strong> Synchronize auth state across tabs using storage events or BroadcastChannel.
          </li>
          <li>
            <strong>Logout Propagation:</strong> When user logs out, invalidate tokens and propagate logout to all tabs.
          </li>
          <li>
            <strong>Monitor Auth Metrics:</strong> Track login success rate, refresh failure rate, and IdP latency. Alert on anomalies.
          </li>
          <li>
            <strong>Have Fallback:</strong> If using social login, also offer email/password fallback in case IdP is unavailable.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using Implicit Flow:</strong> Implicit Flow is deprecated and insecure. Use Authorization Code with PKCE.
          </li>
          <li>
            <strong>Storing Tokens in localStorage:</strong> Any XSS vulnerability can steal tokens. Use httpOnly cookies or memory.
          </li>
          <li>
            <strong>No State Parameter:</strong> Without state parameter, OAuth flow is vulnerable to CSRF attacks.
          </li>
          <li>
            <strong>Long Access Token Lifetime:</strong> Long-lived access tokens increase damage window if stolen. Keep them short.
          </li>
          <li>
            <strong>No Refresh Token Rotation:</strong> Static refresh tokens can be reused indefinitely if stolen. Rotate on each use.
          </li>
          <li>
            <strong>Wildcard Redirect URIs:</strong> Allowing wildcard redirect URIs enables phishing attacks. Register exact URIs.
          </li>
          <li>
            <strong>Ignoring IdP Outages:</strong> IdPs can go down. Implement retry logic and fallback authentication.
          </li>
          <li>
            <strong>No Multi-Tab Sync:</strong> Users expect login/logout to sync across tabs. Implement cross-tab communication.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>SaaS Platform: Multi-Tenant OAuth</h3>
        <p>
          <strong>Problem:</strong> SaaS platform needed to support multiple IdPs (Google, Microsoft, Okta) for different enterprise customers.
        </p>
        <p>
          <strong>Solution:</strong> Implemented dynamic IdP discovery based on user email domain. Used Authorization Code with PKCE for all flows. Stored tokens in httpOnly cookies with BFF pattern.
        </p>
        <p>
          <strong>Results:</strong> Supported 50+ enterprise IdPs. Zero security incidents. Enterprise customers passed security audits.
        </p>

        <h3>E-Commerce: Social Login Integration</h3>
        <p>
          <strong>Problem:</strong> E-commerce site had low sign-up conversion. Long registration forms were causing abandonment.
        </p>
        <p>
          <strong>Solution:</strong> Added Google and Facebook login alongside email/password. Used OAuth for social providers. Pre-filled registration form from OAuth profile data.
        </p>
        <p>
          <strong>Results:</strong> Sign-up conversion increased 35%. 60% of new users chose social login. Reduced fraud (verified email from IdP).
        </p>

        <h3>Financial Services: High-Security OAuth</h3>
        <p>
          <strong>Problem:</strong> Financial services company needed OAuth integration with maximum security for banking application.
        </p>
        <p>
          <strong>Solution:</strong> Implemented BFF pattern. Tokens stored in httpOnly cookies on backend. Short access token lifetime (5 minutes). Refresh token rotation with detection. Additional MFA step for sensitive operations.
        </p>
        <p>
          <strong>Results:</strong> Passed regulatory audit (PSD2/SCA compliant). Zero account takeover incidents. Customer trust increased.
        </p>

        <h3>Media Site: Content Personalization</h3>
        <p>
          <strong>Problem:</strong> Media site wanted to personalize content based on user identity but didn't want to manage passwords.
        </p>
        <p>
          <strong>Solution:</strong> Used Auth0 as IdP. Implemented OAuth with social login options. Stored minimal user data (user_id, preferences). Used JWT claims for personalization.
        </p>
        <p>
          <strong>Results:</strong> 50% of users logged in (up from 20%). Personalization increased engagement 25%. No password management overhead.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is OAuth 2.0 and how does it differ from authentication?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              OAuth 2.0 is an <strong>authorization framework</strong>, not an authentication protocol. It allows users to grant third-party applications limited access to their resources without sharing credentials.
            </p>
            <p className="mb-3">
              The key distinction:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Authentication:</strong> Verifying who the user is (login). OpenID Connect (OIDC) adds authentication on top of OAuth.
              </li>
              <li>
                <strong>Authorization:</strong> Granting access to resources (OAuth's purpose).
              </li>
            </ul>
            <p>
              In practice, OAuth is often used for authentication via OIDC, which adds an ID token containing user identity information. But OAuth alone doesn't authenticate—it only authorizes access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Why is PKCE required for SPAs and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              PKCE (Proof Key for Code Exchange) is required for SPAs because they are <strong>public clients</strong>—they cannot securely store client secrets. Without PKCE, authorization codes can be intercepted and exchanged for tokens.
            </p>
            <p className="mb-3">
              How PKCE works:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Before redirect:</strong> Client generates code_verifier (random string) and derives code_challenge = SHA256(code_verifier).
              </li>
              <li>
                <strong>Authorization request:</strong> Client sends code_challenge to IdP.
              </li>
              <li>
                <strong>Token exchange:</strong> Client sends code_verifier to IdP. IdP verifies it matches code_challenge.
              </li>
            </ul>
            <p>
              Even if an attacker intercepts the authorization code, they cannot exchange it for tokens without the code_verifier. This prevents code interception attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Where should you store OAuth tokens in a SPA and why?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>httpOnly Cookies (Recommended):</strong> JavaScript cannot access cookies, protecting against XSS token theft. Requires backend to set cookies. Use SameSite=Strict and CSRF tokens.
              </li>
              <li>
                <strong>Memory (Acceptable):</strong> Tokens stored in JavaScript variables. Cleared on page refresh. XSS can still steal tokens while page is loaded. Use with refresh tokens for session continuity.
              </li>
              <li>
                <strong>localStorage (Not Recommended):</strong> Any XSS vulnerability can steal tokens. Tokens persist across sessions (including attacker's access). Never use for tokens.
              </li>
            </ul>
            <p>
              The security principle is <strong>minimize token exposure</strong>. httpOnly cookies provide the best protection because tokens are never exposed to JavaScript.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the difference between access tokens and refresh tokens?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Access Token:</strong> Short-lived (5-60 minutes). Used to access protected resources (API calls). If stolen, attacker has limited time to misuse.
              </li>
              <li>
                <strong>Refresh Token:</strong> Long-lived (days to months). Used to obtain new access tokens without re-authentication. Must be stored more securely. Should be rotated on each use.
              </li>
            </ul>
            <p className="mb-3">
              The two-token pattern provides a balance:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                Short-lived access tokens limit damage if stolen.
              </li>
              <li>
                Long-lived refresh tokens enable persistent sessions without frequent re-authentication.
              </li>
              <li>
                Refresh token rotation detects theft (if stolen token is used, legitimate user's next refresh fails).
              </li>
            </ul>
            <p>
              This pattern is industry standard and recommended by all major IdPs (Auth0, Okta, AWS Cognito, Google).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you handle OAuth token expiration and renewal?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Detect Expiration:</strong> Check token expiry before API calls. Or handle 401 responses from API.
              </li>
              <li>
                <strong>Silent Refresh:</strong> Use refresh token to obtain new access token in background. User doesn't notice.
              </li>
              <li>
                <strong>Refresh Token Expiry:</strong> If refresh token is also expired, user must re-authenticate. Redirect to login.
              </li>
              <li>
                <strong>Multi-Tab:</strong> If one tab refreshes tokens, propagate new tokens to other tabs via storage events or BroadcastChannel.
              </li>
              <li>
                <strong>Concurrent Refresh:</strong> If multiple API calls trigger refresh simultaneously, ensure only one refresh request is made (deduplicate).
              </li>
            </ul>
            <p>
              Implement token renewal as a transparent background process. Users should only be interrupted for re-authentication if refresh token is expired or revoked.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are the security risks of OAuth and how do you mitigate them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Code Interception:</strong> Mitigation: PKCE. Even intercepted codes cannot be exchanged.
              </li>
              <li>
                <strong>CSRF:</strong> Mitigation: State parameter. Verify state matches on callback.
              </li>
              <li>
                <strong>Token Theft (XSS):</strong> Mitigation: httpOnly cookies, CSP, short token lifetimes.
              </li>
              <li>
                <strong>Redirect URI Manipulation:</strong> Mitigation: Register exact redirect URIs with IdP. No wildcards.
              </li>
              <li>
                <strong>Refresh Token Theft:</strong> Mitigation: Refresh token rotation, detect reuse.
              </li>
              <li>
                <strong>IdP Impersonation:</strong> Mitigation: Verify IdP domain, use well-known configuration endpoint.
              </li>
            </ul>
            <p>
              Defense in depth is key: use multiple mitigations together, not just one. PKCE + state + httpOnly cookies + short lifetimes provides layered protection.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://oauth.net/2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OAuth.net
            </a> — Official OAuth 2.0 documentation and specifications.
          </li>
          <li>
            <a href="https://openid.net/connect/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenID Connect
            </a> — OIDC specification for authentication on top of OAuth.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc7636" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7636: PKCE
            </a> — PKCE specification for public clients.
          </li>
          <li>
            <a href="https://auth0.com/docs/flows/authorization-code-flow-with-pkce" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0: Authorization Code Flow with PKCE
            </a> — Practical guide to implementing OAuth with PKCE.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP: Authentication Cheat Sheet
            </a> — Security guidance for authentication implementations.
          </li>
          <li>
            <a href="https://tools.ietf.org/html/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749: OAuth 2.0 Framework
            </a> — Core OAuth 2.0 specification.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
