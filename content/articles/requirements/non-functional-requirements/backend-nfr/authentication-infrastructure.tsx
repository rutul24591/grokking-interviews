"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-authentication-infrastructure-extensive",
  title: "Authentication Infrastructure",
  description: "Comprehensive guide to authentication infrastructure, covering OAuth 2.0, OIDC, SAML, JWT, session management, MFA, and production patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "authentication-infrastructure",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "authentication", "oauth", "oidc", "jwt", "session", "mfa", "security"],
  relatedTopics: ["authorization-model", "secrets-management", "rate-limiting-abuse-protection", "api-versioning"],
};

export default function AuthenticationInfrastructureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Authentication</strong> is the process of verifying a user&apos;s identity.
          <strong>Authentication Infrastructure</strong> encompasses all the systems, protocols, and patterns
          that enable secure identity verification at scale.
        </p>
        <p>
          Authentication is distinct from authorization:
        </p>
        <ul>
          <li>
            <strong>Authentication (AuthN):</strong> &quot;Who are you?&quot; — Verifying identity.
          </li>
          <li>
            <strong>Authorization (AuthZ):</strong> &quot;What can you do?&quot; — Verifying permissions.
          </li>
        </ul>
        <p>
          Authentication must always happen before authorization. You cannot determine what someone can do
          until you know who they are.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Authentication is a Chain</h3>
          <p>
            Authentication is only as strong as its weakest link. A secure system requires secure credential
            storage, secure transmission, secure token handling, and secure session management. A breach at
            any point compromises the entire system.
          </p>
        </div>
      </section>

      <section>
        <h2>Authentication vs Authorization</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/authn-vs-authz.svg"
          alt="Authentication vs Authorization"
          caption="Authentication vs Authorization — showing the difference between verifying identity (AuthN) and verifying permissions (AuthZ) with flow diagrams and real-world analogy"
        />
      </section>

      <section>
        <h2>Authentication Protocols</h2>
        <p>
          Several protocols enable authentication across different scenarios:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OAuth 2.0</h3>
        <p>
          <strong>OAuth 2.0</strong> is an authorization framework that enables third-party applications to
          access user resources without exposing credentials.
        </p>
        <p>
          <strong>Key concepts:</strong>
        </p>
        <ul>
          <li>
            <strong>Resource Owner:</strong> The user.
          </li>
          <li>
            <strong>Client:</strong> The application requesting access.
          </li>
          <li>
            <strong>Resource Server:</strong> The API hosting protected resources.
          </li>
          <li>
            <strong>Authorization Server:</strong> Issues access tokens after authenticating user.
          </li>
        </ul>
        <p>
          <strong>Common flows:</strong>
        </p>
        <ul>
          <li>
            <strong>Authorization Code:</strong> Most secure, for server-side apps. User redirected to auth
            server, returns with code, code exchanged for token.
          </li>
          <li>
            <strong>PKCE (Proof Key for Code Exchange):</strong> Enhanced authorization code flow for mobile
            and SPA apps. Prevents code interception attacks.
          </li>
          <li>
            <strong>Client Credentials:</strong> For machine-to-machine authentication. No user involved.
          </li>
          <li>
            <strong>Device Code:</strong> For devices with limited input (TVs, IoT).
          </li>
        </ul>
        <p>
          <strong>Interview insight:</strong> OAuth 2.0 is for authorization, not authentication. Use OIDC
          for authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OpenID Connect (OIDC)</h3>
        <p>
          <strong>OIDC</strong> is an identity layer built on OAuth 2.0. It adds authentication to OAuth&apos;s
          authorization.
        </p>
        <p>
          <strong>Key additions:</strong>
        </p>
        <ul>
          <li>
            <strong>ID Token:</strong> JWT containing user identity information (sub, name, email, etc.).
          </li>
          <li>
            <strong>Userinfo Endpoint:</strong> API to get additional user claims.
          </li>
          <li>
            <strong>Standard Scopes:</strong> openid, profile, email, address, phone.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> You need to authenticate users and get their identity information.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SAML 2.0</h3>
        <p>
          <strong>SAML (Security Assertion Markup Language)</strong> is an XML-based protocol for SSO.
        </p>
        <p>
          <strong>Key concepts:</strong>
        </p>
        <ul>
          <li>
            <strong>Identity Provider (IdP):</strong> Authenticates users and issues assertions.
          </li>
          <li>
            <strong>Service Provider (SP):</strong> Application that trusts IdP assertions.
          </li>
          <li>
            <strong>Assertion:</strong> XML document containing authentication and attribute statements.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> Enterprise SSO, B2B integrations, legacy enterprise systems.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Mature, widely supported in enterprise.</li>
          <li>✓ Rich attribute support.</li>
          <li>✗ XML is verbose and complex.</li>
          <li>✗ Less developer-friendly than OIDC.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">JWT (JSON Web Tokens)</h3>
        <p>
          <strong>JWT</strong> is a compact, URL-safe token format for representing claims.
        </p>
        <p>
          <strong>Structure:</strong>
        </p>
        <ul>
          <li>
            <strong>Header:</strong> Algorithm and token type.
          </li>
          <li>
            <strong>Payload:</strong> Claims (sub, exp, iat, custom claims).
          </li>
          <li>
            <strong>Signature:</strong> HMAC or RSA signature for verification.
          </li>
        </ul>
        <p>
          <strong>Use when:</strong> Stateless authentication, microservices, API authentication.
        </p>
        <p>
          <strong>Security considerations:</strong>
        </p>
        <ul>
          <li>Never store sensitive data in JWT (payload is encoded, not encrypted).</li>
          <li>Use short expiration times.</li>
          <li>Implement token revocation strategy.</li>
          <li>Validate signature and all claims.</li>
        </ul>
      </section>

      <section>
        <h2>Authentication Infrastructure Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/authentication-deep-dive.svg"
          alt="Authentication Deep Dive"
          caption="Authentication Deep Dive — showing OAuth 2.0 and OIDC flows, MFA methods comparison, session management strategies"
        />
        <p>
          Advanced authentication concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OAuth 2.0 Flow Deep Dive</h3>
        <p>
          Understanding OAuth 2.0 flows in detail:
        </p>
        <ul>
          <li>
            <strong>Authorization Code:</strong> Most secure flow for server-side applications.
            User is redirected to authorization server, returns with authorization code,
            code is exchanged for access token server-side.
          </li>
          <li>
            <strong>PKCE Flow:</strong> Extension of authorization code flow for mobile and SPA.
            Uses code verifier and challenge to prevent authorization code interception attacks.
          </li>
          <li>
            <strong>Client Credentials:</strong> Machine-to-machine authentication without user context.
            Used for service accounts and backend service communication.
          </li>
          <li>
            <strong>Device Code:</strong> For devices with limited input capabilities like TVs and IoT.
            User enters code on separate device, application polls for authorization.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Methods Comparison</h3>
        <p>
          Multi-factor authentication methods ranked by security and UX:
        </p>
        <ul>
          <li>
            <strong>TOTP Apps (Most Secure + Good UX):</strong> Google Authenticator, Authy.
            Time-based one-time passwords, works offline, no SMS vulnerability.
          </li>
          <li>
            <strong>Push Notifications (Best UX):</strong> One-tap approval on trusted device.
            Phishing-resistant, but requires smartphone and internet.
          </li>
          <li>
            <strong>Hardware Keys (Most Secure):</strong> YubiKey, FIDO2 security keys.
            Phishing-proof, but requires physical device and costs money.
          </li>
          <li>
            <strong>SMS (Weakest):</strong> Text message with code.
            Vulnerable to SIM swapping attacks, should be last resort.
          </li>
          <li>
            <strong>Email Codes (Weakest):</strong> Email verification code.
            Easy to phish, slow, should not be primary MFA method.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management Strategies</h3>
        <p>
          Different approaches to maintaining authenticated state:
        </p>
        <ul>
          <li>
            <strong>Server-Side Sessions:</strong> Store session data in Redis or database.
            Client holds session ID in cookie. Easy to invalidate, but requires state.
          </li>
          <li>
            <strong>JWT Tokens:</strong> Self-contained tokens with claims.
            Stateless, but harder to revoke. Use short expiration with refresh tokens.
          </li>
          <li>
            <strong>Refresh Tokens:</strong> Long-lived tokens used to obtain new access tokens.
            Rotate on use, store securely, invalidate on password change.
          </li>
          <li>
            <strong>Session Invalidation:</strong> Implement logout, password change,
            and suspicious activity detection to invalidate sessions.
          </li>
        </ul>
      </section>

      <section>
        <h2>Session Management</h2>
        <p>
          How to maintain authenticated state across requests:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server-Side Sessions</h3>
        <p>
          Session data stored on server, client holds session ID (usually in cookie).
        </p>
        <p>
          <strong>Pros:</strong>
        </p>
        <ul>
          <li>✓ Easy to revoke (delete session).</li>
          <li>✓ Small client-side storage.</li>
          <li>✓ Sensitive data stays on server.</li>
        </ul>
        <p>
          <strong>Cons:</strong>
        </p>
        <ul>
          <li>✗ Server must maintain session state.</li>
          <li>✗ Scaling requires session sharing (Redis).</li>
          <li>✗ Cookie-based (CSRF protection needed).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token-Based (Stateless)</h3>
        <p>
          Client holds token (JWT) with all necessary claims. Server validates token signature.
        </p>
        <p>
          <strong>Pros:</strong>
        </p>
        <ul>
          <li>✓ Stateless (scales easily).</li>
          <li>✓ Works well for microservices.</li>
          <li>✓ No CSRF vulnerability.</li>
        </ul>
        <p>
          <strong>Cons:</strong>
        </p>
        <ul>
          <li>✗ Hard to revoke (must wait for expiration).</li>
          <li>✗ Larger payload.</li>
          <li>✗ Token theft = access until expiration.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Refresh Token Pattern</h3>
        <p>
          Use short-lived access tokens with long-lived refresh tokens:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>User authenticates, receives access token (15 min) + refresh token (7 days).</li>
          <li>Access token used for API calls.</li>
          <li>When access token expires, use refresh token to get new access token.</li>
          <li>Refresh token can be revoked independently.</li>
        </ol>
        <p>
          <strong>Security:</strong> Store refresh tokens securely (httpOnly cookie or secure storage).
        </p>
      </section>

      <section>
        <h2>Multi-Factor Authentication (MFA)</h2>
        <p>
          MFA requires multiple forms of verification:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Factors</h3>
        <ul>
          <li>
            <strong>Something you know:</strong> Password, PIN.
          </li>
          <li>
            <strong>Something you have:</strong> Phone, hardware token, smart card.
          </li>
          <li>
            <strong>Something you are:</strong> Fingerprint, face, voice (biometrics).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Methods</h3>
        <ul>
          <li>
            <strong>TOTP (Time-based One-Time Password):</strong> Apps like Google Authenticator. Codes
            change every 30 seconds.
          </li>
          <li>
            <strong>SMS:</strong> Code sent via text. Vulnerable to SIM swapping attacks.
          </li>
          <li>
            <strong>Push notifications:</strong> App receives push, user approves. Good UX.
          </li>
          <li>
            <strong>Hardware tokens:</strong> YubiKey, FIDO2. Most secure, requires physical device.
          </li>
          <li>
            <strong>WebAuthn:</strong> Browser-based biometric/hardware authentication. Modern standard.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design an authentication system for a platform with web, mobile, and third-party integrations. What protocols do you use?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Web app:</strong> OIDC with authorization code flow + PKCE. Session cookies for authenticated state.</li>
                <li><strong>Mobile app:</strong> OIDC with authorization code flow + PKCE. Refresh tokens for long-lived sessions.</li>
                <li><strong>Third-party integrations:</strong> OAuth 2.0 with client credentials flow for service-to-service. Access tokens with limited scope.</li>
                <li><strong>Token structure:</strong> JWT with claims: sub, email, roles, permissions, exp, iat. Short-lived access tokens (15 min).</li>
                <li><strong>Identity provider:</strong> Use managed service (Auth0, Cognito, Firebase Auth) or self-hosted (Keycloak).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare OAuth 2.0, OIDC, and SAML. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>OAuth 2.0:</strong> Authorization framework (not authentication). Used for delegated access to resources. Use for: API access, third-party integrations.</li>
                <li><strong>OIDC (OpenID Connect):</strong> Identity layer on top of OAuth 2.0. Adds ID token with user identity. Use for: User authentication, SSO for consumer apps.</li>
                <li><strong>SAML 2.0:</strong> XML-based SSO protocol. Enterprise standard. Use for: Enterprise SSO, B2B integrations, legacy systems.</li>
                <li><strong>Modern choice:</strong> OIDC for new applications (JSON-based, simpler). SAML for enterprise customers (widely supported).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Explain the difference between session-based and token-based authentication. What are the trade-offs?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Session-based:</strong> Server stores session data (Redis/DB). Client holds session ID cookie. ✓ Easy revocation, small cookie. ✗ Server state, sticky sessions needed.</li>
                <li><strong>Token-based (JWT):</strong> Server signs token with claims. Client holds token. ✓ Stateless, scales horizontally. ✗ Hard to revoke, larger token size.</li>
                <li><strong>Choose session when:</strong> Need immediate revocation, sensitive operations (banking), monolithic apps.</li>
                <li><strong>Choose token when:</strong> Microservices, mobile apps, third-party API access, serverless.</li>
                <li><strong>Hybrid:</strong> Short-lived JWT (15 min) + refresh token (stored server-side). Best of both worlds.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you implement secure token storage on the client? Where do you store JWT tokens?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>HttpOnly cookie:</strong> ✓ Protected from XSS (JavaScript can&apos;t access). ✓ Automatic with requests. ✗ CSRF vulnerability (need CSRF token).</li>
                <li><strong>localStorage:</strong> ✓ Easy to use. ✗ Vulnerable to XSS (any script can access). ✗ Not recommended for sensitive tokens.</li>
                <li><strong>Memory (JavaScript variable):</strong> ✓ Cleared on page refresh. ✗ Lost on refresh, still vulnerable to XSS.</li>
                <li><strong>Best practice:</strong> HttpOnly + Secure + SameSite cookies for access token. CSRF token in separate cookie. Refresh token rotation.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design an MFA system. What methods do you support and how do you handle backup/recovery?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Supported methods:</strong> (1) TOTP apps (Google Authenticator, Authy). (2) Push notifications. (3) SMS (fallback). (4) Hardware keys (YubiKey) for high-security.</li>
                <li><strong>Backup codes:</strong> Generate 10 one-time use codes during MFA setup. Store hashed in database. User downloads securely.</li>
                <li><strong>Recovery process:</strong> (1) User requests recovery. (2) Verify identity via email + security questions. (3) Send recovery link. (4) Allow MFA reset.</li>
                <li><strong>Security:</strong> Rate limit recovery attempts. Log all recovery events. Require re-authentication after MFA reset.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you handle token revocation in a stateless JWT-based system?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Short expiration:</strong> Keep access tokens short-lived (15 min). Limits window of misuse.</li>
                <li><strong>Refresh token blacklist:</strong> Store revoked refresh tokens in Redis with TTL. Check on refresh attempt.</li>
                <li><strong>Token versioning:</strong> Include version number in JWT. Increment version on password change/MFA reset. Invalidate old tokens.</li>
                <li><strong>JTI claim:</strong> Include unique token ID (jti) in JWT. Store revoked JTIs in Redis.</li>
                <li><strong>Best practice:</strong> Combine short-lived tokens + refresh token rotation + version number. Immediate revocation for security events.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Authentication Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Selected appropriate protocol (OIDC for auth, OAuth for authorization)</li>
          <li>✓ Implemented secure password storage (bcrypt, Argon2)</li>
          <li>✓ Using HTTPS for all authentication flows</li>
          <li>✓ Token expiration configured (short-lived access tokens)</li>
          <li>✓ Refresh token rotation implemented</li>
          <li>✓ MFA available for sensitive operations</li>
          <li>✓ Session fixation protection</li>
          <li>✓ Rate limiting on authentication endpoints</li>
          <li>✓ Account lockout after failed attempts</li>
          <li>✓ Audit logging for authentication events</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
