"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-oauth-2-0-extensive",
  title: "OAuth 2.0",
  description:
    "Staff-level deep dive into OAuth 2.0 authorization flows, token lifecycle, PKCE, scope design, and the operational practice of securing delegated access at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "oauth-2-0",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "oauth", "authorization", "identity"],
  relatedTopics: ["jwt-json-web-tokens", "authentication-vs-authorization", "single-sign-on-sso", "api-security"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>OAuth 2.0</strong> is an authorization framework that enables a third-party application to obtain
          limited access to a user&apos;s resources on another service, without exposing the user&apos;s credentials. It
          delegates authentication to an authorization server and issues scoped access tokens to clients, which present
          those tokens to resource servers to access protected APIs. OAuth 2.0 is the foundation of modern delegated
          access — it powers &quot;Sign in with Google&quot;, API integrations between services, and service-to-service
          authentication in microservice architectures.
        </p>
        <p>
          OAuth 2.0 is not an authentication protocol — it is an authorization framework. It answers the question
          &quot;What is this client allowed to do?&quot; rather than &quot;Who is this user?&quot; OpenID Connect (OIDC)
          extends OAuth 2.0 to provide authentication — it adds an ID token (JWT) that carries the user&apos;s identity,
          enabling the client to authenticate the user through the OAuth 2.0 flow. In practice, OAuth 2.0 and OIDC are
          used together — OAuth 2.0 for authorization (access tokens) and OIDC for authentication (ID tokens).
        </p>
        <p>
          The evolution of OAuth 2.0 has been driven by security vulnerabilities in its original design. The Implicit
          grant type, originally designed for single-page applications (SPAs), was deprecated because it exposes access
          tokens in the browser&apos;s URL fragment, making them vulnerable to theft via XSS or browser extensions. The
          Authorization Code flow with PKCE (Proof Key for Code Exchange) replaced it — PKCE prevents authorization code
          interception attacks by requiring the client to prove it is the same entity that initiated the flow, even
          without a client secret.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">OAuth 2.0 Roles</h3>
          <p className="text-muted mb-3">
            <strong>Resource Owner:</strong> The user who owns the protected data (e.g., the Google account holder).
          </p>
          <p className="text-muted mb-3">
            <strong>Client:</strong> The application requesting access to the user&apos;s data (e.g., a third-party app that wants to read your Google Calendar).
          </p>
          <p className="text-muted mb-3">
            <strong>Authorization Server:</strong> The server that authenticates the user, obtains consent, and issues tokens (e.g., Google&apos;s OAuth server).
          </p>
          <p>
            <strong>Resource Server:</strong> The server hosting the protected data (e.g., Google Calendar API). It validates access tokens and serves data to authorized clients.
          </p>
        </div>
        <p>
          OAuth 2.0 defines several grant types — flows for obtaining access tokens — each designed for a different
          client type and security context. The Authorization Code grant is the standard for web and mobile applications.
          The Client Credentials grant is used for service-to-service authentication. The Device Authorization grant is
          designed for input-constrained devices (smart TVs, IoT). The Refresh Token grant enables long-lived sessions
          without requiring the user to re-authenticate. The Implicit grant is deprecated and should not be used.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The Authorization Code flow with PKCE is the modern standard for all user-facing OAuth 2.0 flows. The client
          generates a code verifier (a random string) and a code challenge (the SHA-256 hash of the verifier). The
          client redirects the user to the authorization server with the code challenge. The user authenticates and
          consents, and the authorization server redirects back with an authorization code. The client exchanges the
          code for tokens by presenting the code and the original code verifier. The authorization server verifies
          that the challenge matches the verifier — if they match, the client is the same entity that initiated the
          flow, and tokens are issued.
        </p>
        <p>
          PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks. Without PKCE, an
          attacker who intercepts the authorization code (through a malicious app registered with the same redirect
          URI, or through a compromised redirect) can exchange it for tokens. With PKCE, the attacker cannot exchange
          the code because they do not have the code verifier — the verifier was generated by the legitimate client
          and never transmitted during the authorization request.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/oauth-2-0-diagram-1.svg"
          alt="OAuth 2.0 Authorization Code flow with PKCE showing the complete flow from client to authorization server to resource server"
          caption="Authorization Code + PKCE: the client generates a code verifier and challenge, the user authenticates, the authorization server issues an authorization code, and the client exchanges the code for tokens by presenting the verifier."
        />
        <p>
          Access tokens are short-lived credentials (typically 5-15 minutes) that the client presents to the resource
          server to access protected APIs. Access tokens are either JWTs (self-contained, carrying claims that the
          resource server can validate without calling the authorization server) or opaque tokens (references to
          server-side session state that require introspection). The choice between JWTs and opaque tokens depends on
          the trade-off between stateless validation (JWTs) and immediate revocation (opaque tokens).
        </p>
        <p>
          Refresh tokens are long-lived credentials (typically 7-30 days) that the client uses to obtain new access
          tokens without requiring the user to re-authenticate. Refresh tokens should be rotated — each time a refresh
          token is used, a new refresh token is issued and the old one is invalidated. If a refresh token is reused
          (indicating theft), the authorization server detects the reuse and revokes the entire token family, forcing
          the user to re-authenticate.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/oauth-2-0-diagram-2.svg"
          alt="OAuth 2.0 grant types comparison showing authorization code, client credentials, device code, and deprecated implicit flows"
          caption="Grant types: Authorization Code + PKCE for all user-facing flows, Client Credentials for service-to-service, Device Code for input-constrained devices. Implicit grant is deprecated."
        />
        <p>
          Scopes define the permissions that the client is requesting — for example, &quot;read:calendar&quot; and
          &quot;write:calendar&quot; scopes grant read and write access to the user&apos;s calendar. Scopes must be granular —
          broad scopes like &quot;full access&quot; violate the principle of least privilege and give the client more access
          than it needs. Scopes are evaluated by the resource server when validating the access token — if the token
          does not have the required scope for the requested action, the request is denied.
        </p>
        <p>
          The Client Credentials flow is used for service-to-service authentication. The client (a service) authenticates
          to the authorization server using its client ID and client secret (or a signed JWT assertion) and requests an
          access token for a specific scope. The authorization server validates the client credentials and issues an
          access token. The client presents the access token to the target service, which validates the token and
          evaluates the authorization policy for the service-to-service action. This flow does not involve a user — it
          is purely machine-to-machine authentication.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The OAuth 2.0 architecture consists of the authorization server (which issues tokens), the resource server
          (which validates tokens and serves data), and the client (which requests and uses tokens). The authorization
          server manages the token lifecycle — issuance, validation, refresh, and revocation. The resource server
          validates tokens on each request, checking the signature (for JWTs), expiration, issuer, audience, and
          scopes. The client stores tokens securely (httpOnly cookies for web apps, secure storage for mobile apps)
          and presents them with each API request.
        </p>
        <p>
          The token validation flow is critical for security. When the resource server receives a request with an
          access token, it validates the token&apos;s signature (using the authorization server&apos;s public key), checks the
          expiration (rejecting expired tokens), verifies the issuer (ensuring the token was issued by the expected
          authorization server), validates the audience (ensuring the token was intended for this resource server),
          and evaluates the scopes (ensuring the token has the required scope for the requested action). If any
          validation step fails, the request is denied with a 401 Unauthorized response.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/oauth-2-0-diagram-3.svg"
          alt="OAuth 2.0 token lifecycle showing issuance, use, refresh rotation, and revocation of access and refresh tokens"
          caption="Token lifecycle: tokens are issued after authentication, used for API access, refreshed before expiration with rotation, and revoked on logout, compromise, or refresh token reuse detection."
        />
        <p>
          Token storage is a critical operational concern. For web applications, access tokens should be stored in
          httpOnly, Secure, SameSite cookies — this prevents XSS from stealing the token (httpOnly), ensures the
          cookie is only sent over HTTPS (Secure), and prevents CSRF attacks (SameSite). For mobile applications,
          tokens should be stored in the platform&apos;s secure storage (Keychain on iOS, Keystore on Android). Tokens
          should never be stored in localStorage or sessionStorage — these are accessible to JavaScript and vulnerable
          to XSS attacks.
        </p>
        <p>
          Token revocation is essential for security — when a user logs out, changes their password, or a token is
          compromised, the token should be revoked immediately. For opaque tokens, revocation is straightforward —
          the authorization server deletes the session record, and the token becomes invalid. For JWTs, revocation
          requires a denylist (a database of revoked token IDs) that the resource server checks on each request.
          Alternatively, short-lived access tokens (5-15 minutes) limit the window of opportunity — even if a token
          is compromised, it expires quickly, and refresh token rotation ensures that the attacker cannot obtain new
          access tokens.
        </p>
        <p>
          Scope design is an architectural decision that affects the entire system. Scopes should be granular and
          action-oriented — &quot;read:orders&quot; and &quot;write:orders&quot; rather than &quot;orders:full&quot;. Each scope should correspond to a
          specific permission that the resource server evaluates. Overly broad scopes (like &quot;admin&quot; or &quot;full access&quot;)
          should be avoided — they violate the principle of least privilege and make it difficult to audit and revoke
          specific permissions. Scopes should be versioned — when a scope&apos;s meaning changes, the version should be
          incremented (e.g., &quot;read:orders:v2&quot;) to avoid breaking existing clients.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          JWT versus opaque tokens is the primary trade-off in OAuth 2.0 token design. JWTs are self-contained — they
          carry claims that the resource server can validate without calling the authorization server. This enables
          stateless authentication, which is simpler to scale and operate. However, JWTs cannot be revoked until they
          expire — if a JWT is compromised, it remains valid until expiration. Opaque tokens are references to
          server-side session state — the resource server must call the authorization server to validate the token
          and retrieve the claims. This enables immediate revocation, but introduces a network dependency and latency
          on each request.
        </p>
        <p>
          Authorization Code with PKCE versus Implicit grant is a security trade-off that has been resolved in favor
          of PKCE. The Implicit grant was designed for SPAs that could not securely store a client secret. However,
          it exposes access tokens in the browser&apos;s URL fragment, making them vulnerable to theft via XSS or browser
          extensions. PKCE solves this problem — the authorization code is exchanged for tokens server-side (the SPA
          calls its backend, which exchanges the code for tokens), so the access token is never exposed in the URL.
          The Implicit grant is now deprecated by the OAuth 2.0 Security Best Current Practice (RFC 6819bis).
        </p>
        <p>
          Token rotation versus static refresh tokens is a trade-off between security and complexity. Token rotation
          (issuing a new refresh token on each use) detects token theft — if a refresh token is reused, the
          authorization server detects the reuse and revokes the entire token family. This limits the attacker&apos;s
          access and forces the user to re-authenticate. However, rotation adds complexity — the client must handle
          token rotation gracefully, and race conditions (concurrent refresh requests) must be handled correctly.
          Static refresh tokens are simpler but do not detect theft — a stolen refresh token can be used indefinitely
          until it expires.
        </p>
        <p>
          Centralized versus decentralized token validation is a trade-off between consistency and resilience.
          Centralized validation (the resource server calls the authorization server&apos;s introspection endpoint) ensures
          that all resource servers use the same validation logic and that revoked tokens are immediately detected.
          However, it introduces a dependency — if the authorization server is unavailable, resource servers cannot
          validate tokens. Decentralized validation (the resource server validates JWT signatures locally) eliminates
          this dependency, but revoked tokens remain valid until expiration. The recommended approach for most
          organizations is decentralized validation with short-lived tokens (5-15 minutes) — this limits the window
          of opportunity for revoked tokens while maintaining resilience.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use Authorization Code with PKCE for all user-facing flows. This is the only flow recommended by the OAuth
          2.0 Security Best Current Practice for public clients (SPAs, mobile apps). PKCE prevents authorization code
          interception attacks and does not require a client secret, making it suitable for clients that cannot
          securely store secrets.
        </p>
        <p>
          Use short-lived access tokens (5-15 minutes) with refresh token rotation. Short-lived access tokens limit
          the window of opportunity if a token is compromised. Refresh token rotation detects token theft — if a
          refresh token is reused, the authorization server revokes the entire token family. The client must handle
          token rotation gracefully, updating its stored tokens on each refresh.
        </p>
        <p>
          Define granular, action-oriented scopes. Scopes should correspond to specific permissions — &quot;read:orders&quot;,
          &quot;write:orders&quot;, &quot;delete:orders&quot; — rather than broad categories. Each scope should be evaluated by the resource
          server when validating the access token. Avoid broad scopes like &quot;admin&quot; or &quot;full access&quot; — they violate
          the principle of least privilege and make it difficult to audit and revoke specific permissions.
        </p>
        <p>
          Store tokens securely — httpOnly, Secure, SameSite cookies for web applications; Keychain/Keystore for
          mobile applications. Never store tokens in localStorage or sessionStorage — these are accessible to
          JavaScript and vulnerable to XSS attacks. For SPAs, use the Backend-for-Frontend (BFF) pattern — the SPA
          communicates with a backend that manages tokens, so the SPA never handles tokens directly.
        </p>
        <p>
          Validate tokens on every request — check the signature, expiration, issuer, audience, and scopes. Do not
          cache token validation results — a revoked token should be rejected immediately. For JWTs, use a well-tested
          library (jose, PyJWT,jsonwebtoken) — do not implement JWT validation yourself, as it is easy to make
          mistakes (accepting unsigned tokens, ignoring expiration, trusting the algorithm header).
        </p>
        <p>
          Log all OAuth 2.0 events — token issuance, token validation, token refresh, and token revocation. These
          logs are essential for incident response — when a breach occurs, the logs tell you which tokens were issued,
          which clients used them, and when they were revoked. Include the client ID, user ID, scopes, and IP address
          in each log entry.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using the Implicit grant for SPAs is a deprecated and dangerous practice. The Implicit grant exposes access
          tokens in the browser&apos;s URL fragment, making them vulnerable to theft via XSS or browser extensions. The fix
          is to use Authorization Code with PKCE — the authorization code is exchanged for tokens server-side, so the
          access token is never exposed in the URL.
        </p>
        <p>
          Storing tokens in localStorage is a common security pitfall. localStorage is accessible to any JavaScript
          running on the page — including malicious scripts injected via XSS. The fix is to store tokens in httpOnly
          cookies (for web applications) or in the platform&apos;s secure storage (for mobile applications). For SPAs, use
          the BFF pattern — the SPA communicates with a backend that manages tokens, so the SPA never handles tokens
          directly.
        </p>
        <p>
          Not validating token scopes on the resource server is a common authorization pitfall. The resource server
          must evaluate the token&apos;s scopes for each request — if the token does not have the required scope for the
          requested action, the request should be denied. Without scope validation, a token with &quot;read:orders&quot; scope
          could be used to delete orders.
        </p>
        <p>
          Long-lived access tokens (24 hours or more) are a common operational pitfall. If an access token is
          compromised, the attacker has access for the token&apos;s entire lifetime. The fix is to use short-lived access
          tokens (5-15 minutes) with refresh token rotation — if a token is compromised, the attacker&apos;s access is
          limited to the token&apos;s short lifetime, and the refresh token rotation detects theft and revokes the token
          family.
        </p>
        <p>
          Not handling token rotation race conditions is a common implementation pitfall. When multiple concurrent
          requests trigger a token refresh simultaneously, the client may send multiple refresh requests with the same
          refresh token. The authorization server may reject the second request (because the first refresh already
          consumed the token), causing the client to lose its refresh token. The fix is to implement a token refresh
          queue — the first request triggers the refresh, and subsequent requests wait for the result, using the new
          refresh token from the first response.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses OAuth 2.0 for third-party integrations — partners (shipping providers,
          payment processors) authenticate using the Client Credentials flow to access the platform&apos;s APIs. Each
          partner is assigned a client ID and client secret, with scopes limited to the specific APIs they need
          (e.g., &quot;read:orders&quot; and &quot;write:shipments&quot;). Access tokens are short-lived (15 minutes), and the partner&apos;s
          service refreshes them automatically. The platform logs all token issuance and API access events for audit
          and incident response.
        </p>
        <p>
          A financial services company uses OAuth 2.0 with PKCE for its mobile banking app. Users authenticate
          through the app, which uses the Authorization Code flow with PKCE to obtain access and refresh tokens.
          Access tokens are short-lived (5 minutes) and stored in the device&apos;s secure storage (Keychain on iOS,
          Keystore on Android). Refresh tokens are rotated on each use, and if a refresh token is reused, the entire
          token family is revoked and the user is forced to re-authenticate. The app uses the BFF pattern — the mobile
          app communicates with a backend that manages tokens, so the app never handles tokens directly.
        </p>
        <p>
          A healthcare organization uses OAuth 2.0 for federated identity — healthcare providers authenticate through
          their organization&apos;s identity provider (Okta, Active Directory) using OIDC (built on OAuth 2.0). The
          identity provider issues ID tokens (for authentication) and access tokens (for authorization) with scopes
          limited to the provider&apos;s role and assigned patients. The authorization system enforces ReBAC — providers
          can access patient records for patients they are assigned to. When a provider is reassigned, their access
          tokens are revoked, and they must re-authenticate to obtain new tokens with the updated scopes.
        </p>
        <p>
          A SaaS platform uses OAuth 2.0 for its public API — third-party developers register applications, receive
          client credentials, and use the Authorization Code flow with PKCE to obtain access tokens on behalf of
          users. The platform provides granular scopes (&quot;read:documents&quot;, &quot;write:documents&quot;, &quot;admin:settings&quot;) and
          evaluates scopes on each API request. Access tokens expire in 15 minutes, and refresh tokens are rotated on
          each use. The platform provides a developer portal where developers can manage their applications, view API
          usage, and revoke access tokens.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is PKCE and why is it essential for OAuth 2.0 flows?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks. The client generates a code verifier (random string) and code challenge (SHA-256 hash of the verifier). During the token exchange, the client presents the verifier, and the authorization server verifies it matches the challenge. This proves the client is the same entity that initiated the flow.
            </p>
            <p>
              PKCE is essential because without it, an attacker who intercepts the authorization code can exchange it for tokens. PKCE is now required for all public clients (SPAs, mobile apps) and recommended for all OAuth 2.0 flows, including confidential clients.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you handle token revocation in a distributed system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              For opaque tokens, revocation is straightforward — delete the session record on the authorization server, and the token becomes invalid on the next introspection call. For JWTs, revocation requires a denylist (a distributed database of revoked token IDs) that each resource server checks on every request.
            </p>
            <p>
              Alternatively, use short-lived access tokens (5-15 minutes) with refresh token rotation. If a token is compromised, the attacker&apos;s access is limited to the token&apos;s short lifetime. Refresh token rotation detects theft — if a refresh token is reused, the entire token family is revoked.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the difference between OAuth 2.0 and OpenID Connect?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              OAuth 2.0 is an authorization framework — it enables clients to obtain access tokens for accessing protected resources. It does not authenticate the user — it only authorizes the client to access specific resources with specific scopes.
            </p>
            <p>
              OpenID Connect (OIDC) extends OAuth 2.0 to provide authentication. It adds an ID token (JWT) that carries the user&apos;s identity (sub claim), enabling the client to authenticate the user through the OAuth 2.0 flow. OIDC also adds a UserInfo endpoint for retrieving additional user claims. In practice, OAuth 2.0 and OIDC are used together — OAuth 2.0 for authorization (access tokens) and OIDC for authentication (ID tokens).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you design scopes for a multi-tenant API?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Scopes should be granular and action-oriented — &quot;read:orders&quot;, &quot;write:orders&quot;, &quot;delete:orders&quot; — rather than broad categories. Each scope should correspond to a specific permission that the resource server evaluates. For multi-tenant APIs, scopes should not include tenant context — tenant isolation is enforced through the access token&apos;s claims (tenant ID), not through scopes.
            </p>
            <p>
              Scopes should be versioned — when a scope&apos;s meaning changes, increment the version (e.g., &quot;read:orders:v2&quot;) to avoid breaking existing clients. Avoid broad scopes like &quot;admin&quot; or &quot;full access&quot; — they violate the principle of least privilege and make it difficult to audit and revoke specific permissions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are the security risks of the Implicit grant, and why was it deprecated?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The Implicit grant exposes access tokens in the browser&apos;s URL fragment (the part after the #), making them vulnerable to theft via XSS attacks, malicious browser extensions, or referrer header leakage. The token is also exposed in the browser&apos;s history and server logs if the redirect URI is not properly configured.
            </p>
            <p>
              The Implicit grant was deprecated by the OAuth 2.0 Security Best Current Practice (RFC 6819bis) in favor of Authorization Code with PKCE. PKCE provides the same user experience (no client secret required) but is significantly more secure — the authorization code is exchanged for tokens server-side, so the access token is never exposed in the URL.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749: The OAuth 2.0 Authorization Framework
            </a> — The core OAuth 2.0 specification.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc7636" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7636: PKCE
            </a> — Proof Key for Code Exchange specification.
          </li>
          <li>
            <a href="https://openid.net/connect/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenID Connect Core 1.0
            </a> — Authentication layer on top of OAuth 2.0.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OAuth 2.0 Security Best Current Practice
            </a> — Current security recommendations, including deprecation of Implicit grant.
          </li>
          <li>
            <a href="https://www.oauth.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OAuth.com
            </a> — Comprehensive guide to OAuth 2.0 implementation and best practices.
          </li>
          <li>
            <a href="https://aaronparecki.com/oauth-2-simplified/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OAuth 2 Simplified
            </a> — Aaron Parecki&apos;s accessible guide to OAuth 2.0 flows.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}