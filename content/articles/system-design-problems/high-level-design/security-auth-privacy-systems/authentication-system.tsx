"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-authentication-system",
  title: "Design an Authentication System (OAuth, SSO, MFA Flows)",
  description:
    "Architecture for a complete authentication system frontend: OAuth 2.0 authorization code flow with PKCE, SSO with SAML and OIDC, multi-factor authentication (TOTP, WebAuthn, SMS OTP), session management with refresh token rotation, silent token refresh via hidden iframe, login form with credential autofill and passkey support, brute-force protection UI, account recovery flows, and cross-domain SSO session propagation.",
  category: "high-level-design",
  subcategory: "security-auth-privacy-systems",
  slug: "authentication-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "oauth", "oidc", "sso", "mfa", "webauthn", "pkce", "refresh-token", "passkey", "session-management"],
  relatedTopics: ["secure-token-session-handling", "account-security-dashboard"],
};

export default function AuthenticationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Designing an authentication system for a modern web application involves three distinct flows: direct credential login (username/password with MFA), federated identity via OAuth 2.0 / OIDC (Google, GitHub, enterprise SSO), and passwordless authentication (WebAuthn passkeys, magic links). Each flow has different security properties, UX tradeoffs, and implementation complexity. The frontend is responsible for the visible portion of these flows — the login form, OAuth redirect, MFA challenge, and session state — but it cannot and must not own the security-critical cryptographic operations, which belong on the server.</p>
        <p>The key security principle for authentication frontends: the browser is an untrusted environment. Any secret stored in localStorage, sessionStorage, or accessible to JavaScript can be exfiltrated by XSS. Session tokens must be stored in HttpOnly cookies (not accessible to JS); the CSRF token must accompany every state-changing request; PKCE (Proof Key for Code Exchange) prevents OAuth authorization code interception. The frontend handles UX flow and display; the server enforces all security invariants.</p>
        <p><strong>Explicit scope:</strong> OAuth 2.0 authorization code + PKCE flow, OIDC SSO, TOTP and WebAuthn MFA challenges, refresh token rotation, and login form security UX. Not in scope: server-side session store, password hashing, or cryptographic algorithm selection.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>OAuth 2.0 + PKCE flow:</strong> The user clicks "Sign in with Google." The client generates a cryptographically random code verifier (43–128 characters), derives the code challenge (SHA-256 hash, base64url-encoded), stores the verifier in sessionStorage, and redirects to the authorization server with code_challenge and code_challenge_method=S256. On redirect back, the client sends the authorization code + code verifier to the backend. The backend exchanges code + verifier for tokens at the authorization server. PKCE prevents authorization code theft because the verifier must match the challenge.</li>
          <li><strong>SSO with OIDC:</strong> Enterprise customers configure OIDC or SAML providers. On login, the client queries the backend for the user's SSO configuration by email domain (GET /api/auth/sso-config?domain=company.com). If an SSO provider exists, the user is redirected to the identity provider's login page. On return, the ID token is validated server-side (signature, issuer, audience, expiry). The frontend receives a session cookie on successful validation.</li>
          <li><strong>MFA challenges:</strong> After primary credential verification, the server returns a 200 with &#123;mfaRequired: true, mfaToken: "challenge-token", mfaMethods: ["totp", "webauthn"]&#125;. The frontend shows the MFA screen. For TOTP: the user enters a 6-digit code from their authenticator app; the client POSTs &#123;mfaToken, totpCode&#125; to the verification endpoint. For WebAuthn: the client calls navigator.credentials.get(&#123;publicKey: serverChallenge&#125;) and sends the assertion back to the server.</li>
          <li><strong>Silent token refresh:</strong> Access tokens expire in 15 minutes. The client proactively refreshes when the token has &lt;2 minutes remaining (or on any 401 response). Refresh uses the HttpOnly refresh token cookie (automatically sent by the browser) — no JS access to the refresh token. The refresh endpoint returns a new access token (in a short-lived cookie or response body for the in-memory access token pattern).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Token storage:</strong> Access tokens are stored in memory (JavaScript variable, not localStorage) and re-fetched via the refresh endpoint on page reload. Refresh tokens are stored in HttpOnly, Secure, SameSite=Strict cookies. This pattern prevents XSS from accessing the access token across reloads (the memory is cleared) while keeping refresh tokens safe from JS theft.</li>
          <li><strong>Brute-force protection:</strong> After 5 failed login attempts, the server returns a 429 with a lockout duration. The frontend shows "Account locked. Try again in X minutes" with a countdown timer. The login button is disabled. A CAPTCHA challenge (reCAPTCHA v3) is shown after 3 failed attempts to distinguish human from bot.</li>
          <li><strong>Login form security:</strong> The password field uses type="password" with autocomplete="current-password" for password manager compatibility. The username field uses autocomplete="email". The submit button uses type="submit" (not type="button") so the native form submit behavior (Enter key) works. Passkey support: the login form shows a "Sign in with passkey" button if navigator.credentials.get is available and the user has registered a passkey.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The authentication flow is modeled as a state machine: Unauthenticated → LoginForm → (MFAChallenge | OAuthRedirect) → Authenticated → (TokenRefresh loop) → Unauthenticated (on logout or token revocation). The React authentication context (AuthContext) holds the current auth state and provides login/logout/refresh methods. Components subscribe to the context to get the current user and token. The axios (or fetch) interceptor automatically attaches the in-memory access token to every API request and triggers a silent refresh on 401 responses, transparent to the calling component.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/authentication-system.svg"
          alt="Authentication system flows: OAuth PKCE (client generates codeVerifier; SHA-256 → codeChallenge; redirect to /authorize?code_challenge=…; auth server → redirect back with code; client sends code+verifier to backend; backend exchanges with auth server; HttpOnly session cookie set), SSO OIDC (email domain lookup: GET /auth/sso-config?domain=company.com; redirect to IdP; IdP returns id_token; backend validates sig+iss+aud+exp; session cookie set), MFA (primary login → server 200 &#123;mfaRequired:true, mfaToken, methods:['totp','webauthn']&#125;; TOTP: user enters 6-digit code; WebAuthn: navigator.credentials.get(publicKey challenge) → assertion sent), token lifecycle (access token in memory 15min TTL; refresh token in HttpOnly cookie; refresh when &lt;2min remain or on 401; POST /auth/refresh → new access token; page reload: memory cleared → /auth/refresh on mount; logout: POST /auth/logout clears cookie), brute force protection (5 failures → 429 lockout; countdown timer; login button disabled; 3 failures → reCAPTCHA v3 challenge)."
          caption="OAuth 2.0 PKCE flow (codeVerifier→SHA-256 codeChallenge→redirect→code exchange at backend), OIDC SSO (email domain lookup → IdP redirect → id_token server validation), MFA state machine (mfaToken challenge → TOTP 6-digit or WebAuthn assertion), access token in memory + HttpOnly refresh cookie rotation, brute-force 5-attempt lockout + reCAPTCHA at 3 failures"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">OAuth 2.0 Authorization Code + PKCE</h3>
        <p>PKCE (RFC 7636) prevents authorization code interception attacks by requiring the client to prove it initiated the request. Implementation steps: (1) Generate code verifier: a cryptographically random string of 43–128 characters using window.crypto.getRandomValues and base64url encoding. (2) Derive code challenge: SHA-256 hash of the verifier, base64url-encoded without padding — computed using SubtleCrypto: await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)). (3) Store the verifier in sessionStorage (not localStorage — sessionStorage is cleared when the tab closes, preventing verifier reuse). (4) Redirect to the authorization server with parameters: response_type=code, client_id, redirect_uri, scope, state (random nonce stored in sessionStorage for CSRF protection), code_challenge, code_challenge_method=S256. (5) On redirect callback, verify state parameter matches sessionStorage value (CSRF check), then POST authorization code + code verifier to the backend. (6) Backend exchanges code + verifier with the auth server and sets HttpOnly session cookies.</p>
        <p>The state parameter is critical: it must be verified on the callback to prevent CSRF attacks where an attacker tricks the user into completing an OAuth flow with the attacker's authorization code. The state should be a random nonce generated per login attempt, stored in sessionStorage, and cleared after verification.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">WebAuthn Passkey Authentication</h3>
        <p>WebAuthn (Web Authentication API) provides phishing-resistant authentication using public key cryptography. The browser manages private keys in a secure enclave (TouchID, FaceID, Windows Hello, or a hardware security key). Registration flow: (1) Server generates a registration challenge (random bytes); (2) Client calls navigator.credentials.create(&#123;publicKey: &#123;challenge, rp: &#123;name, id&#125;, user: &#123;id, name, displayName&#125;, pubKeyCredParams: [&#123;type: "public-key", alg: -7&#125;]&#125;&#125;); (3) Browser prompts for biometric/PIN; (4) Client sends the attestation to the server; (5) Server verifies and stores the public key. Authentication flow: (1) Server sends a new challenge; (2) Client calls navigator.credentials.get(&#123;publicKey: &#123;challenge, allowCredentials: [&#123;id: credentialId, type: "public-key"&#125;]&#125;&#125;); (3) Browser authenticates with biometric; (4) Client sends assertion to server; (5) Server verifies signature with stored public key.</p>
        <p>Progressive enhancement for passkeys: the "Sign in with passkey" button is conditionally rendered based on PublicKeyCredential.isConditionalMediationAvailable() — a static async method that returns true if the browser supports conditional UI (autofill-integrated passkey selection). If available, the username field shows a passkey suggestion in the autofill dropdown without requiring the user to click a separate button.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">In-Memory Access Token + HttpOnly Refresh Cookie</h3>
        <p>The dual-token pattern: access tokens are short-lived (15 minutes) and stored in JavaScript memory (a module-level variable in the auth service). This means: an XSS attack cannot steal the access token across page reloads (memory is cleared on reload). On each page load, the application silently refreshes the token (POST /auth/refresh with the HttpOnly cookie — the browser automatically includes it). If the refresh succeeds, the new access token is stored in memory. If it fails (cookie expired, revoked), the user is redirected to login. The refresh cookie is HttpOnly (inaccessible to JS), Secure (HTTPS only), SameSite=Strict (no cross-site sending), and has a 30-day expiry with sliding renewal (each use extends the expiry).</p>
        <p>Refresh token rotation: every use of the refresh token issues a new refresh token and invalidates the old one. If a stolen refresh token is used by an attacker after the legitimate user has rotated it, the server detects a used token (the old one was already rotated) and revokes the entire token family (all refresh tokens for that session), forcing re-authentication. This refresh token reuse detection is a key security property implemented server-side, but the frontend must handle the case where the refresh returns a 401 (family revocation) — it must clear the in-memory state and redirect to login without entering an infinite refresh loop.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">MFA Challenge State Machine</h3>
        <p>The MFA flow is a multi-step form driven by a state machine. States: LoginForm → (submit credentials) → VerifyingCredentials → (mfaRequired: true) → MFAChallenge → (submit MFA code) → VerifyingMFA → (success) → Authenticated. The server-issued mfaToken is a short-lived (5-minute TTL) one-time token that ties the MFA challenge to the primary credential verification — it prevents MFA bypass by someone who only has the second factor without having completed primary authentication. The MFA screen shows available methods (TOTP, WebAuthn, recovery code). If the user's authenticator app is unavailable, a "Use a recovery code" link shows a text field for a one-time recovery code (pre-generated and stored by the user during MFA setup).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Cookie-based vs. Bearer token for access tokens: storing the access token in an HttpOnly cookie (vs. memory + Authorization header) simplifies the silent refresh (no JS needed for page reload recovery) but requires CSRF protection on every state-changing request. Storing in memory requires a refresh on every page load (one extra round trip) but eliminates CSRF risk (cookies are not sent as Authorization headers). The memory pattern is preferred for SPAs because the CSRF attack surface is eliminated and the extra refresh round trip is typically fast (under 200ms, transparent to the user).</p>
        <p>SSO session propagation across subdomains: when a user signs into app.company.com via SSO, they expect to be automatically logged into api.company.com. Cross-subdomain session propagation requires: (1) session cookies scoped to .company.com (not app.company.com) — achieved by setting the cookie Domain attribute; (2) the identity provider's session cookie (set on login.company.com) must also be scoped to .company.com. In practice, most OIDC identity providers set their session cookie on their own domain (login.company.com) and the application uses a service provider session (app.company.com) linked to the IdP session. SSO re-authentication is handled via a silent iframe redirect to the IdP (the IdP recognizes its session cookie and issues a new authorization code without user interaction).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A complete authentication system frontend handles: (1) OAuth 2.0 PKCE (codeVerifier → SHA-256 codeChallenge → redirect with state nonce → callback CSRF check → backend code exchange → HttpOnly cookie); (2) OIDC SSO (email domain lookup → IdP redirect → server-side id_token validation → session cookie); (3) MFA state machine (mfaRequired: true + mfaToken → TOTP 6-digit POST or WebAuthn navigator.credentials.get assertion → server verify); (4) in-memory access token + HttpOnly refresh cookie rotation (refresh on &lt;2min remaining or 401, reuse detection revokes token family, page load triggers silent refresh); and (5) brute-force protection (5-attempt lockout with countdown, reCAPTCHA at 3 failures, login button disabled). The defining security principle: the browser is untrusted — every authentication secret (refresh token, session token, private key) must live outside JavaScript's reach in HttpOnly cookies or hardware-backed secure enclaves.</p>
      </section>
    </ArticleLayout>
  );
}
