"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-authentication-infrastructure",
  title: "Authentication Infrastructure",
  description: "Comprehensive guide to authentication infrastructure — OAuth 2.0, OIDC, SAML, token-based auth, session management, MFA, and identity federation for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "authentication-infrastructure",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "authentication", "oauth", "oidc", "saml", "mfa", "identity"],
  relatedTopics: ["authorization-model", "api-versioning", "latency-slas", "high-availability"],
};

export default function AuthenticationInfrastructureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Authentication infrastructure</strong> is the system that verifies the identity of users,
          services, and devices accessing your application. It is the foundation of all security controls —
          if authentication is compromised, every other security mechanism (authorization, encryption, audit
          logging) becomes irrelevant because the attacker is operating as a legitimate identity.
        </p>
        <p>
          Authentication infrastructure encompasses identity providers (IdPs), authentication protocols (OAuth
          2.0, OpenID Connect, SAML, LDAP), token formats (JWT, opaque tokens, SAML assertions), session
          management (cookies, token storage, refresh mechanisms), and multi-factor authentication (MFA).
          For modern applications, authentication must support multiple identity sources (enterprise SSO,
          social login, email/password, passkeys), scale to millions of concurrent sessions, and maintain
          sub-100ms authentication latency.
        </p>
        <p>
          For staff and principal engineer candidates, authentication infrastructure design demonstrates
          understanding of security fundamentals, protocol expertise, and the ability to balance security
          with user experience. Interviewers expect you to design authentication flows that resist common
          attacks (credential stuffing, token theft, replay attacks), manage identity federation across
          organizations, and handle the operational complexity of running authentication at scale.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Authentication vs Authorization</h3>
          <p>
            <strong>Authentication</strong> answers &quot;who are you?&quot; — verifying identity through
            credentials, tokens, or biometrics. <strong>Authorization</strong> answers &quot;what are you
            allowed to do?&quot; — verifying permissions after identity is established. Authentication always
            precedes authorization. A system can authenticate without authorizing (verifying identity but
            denying access), but cannot authorize without authenticating.
          </p>
          <p className="mt-3">
            In interviews, always clarify whether the problem is authentication (verifying identity) or
            authorization (verifying permissions). The architectural patterns and failure modes differ
            significantly.
          </p>
        </div>

        <p>
          Authentication is also the most user-visible security mechanism — every user interacts with login
          flows, password resets, and MFA prompts. A poorly designed authentication system frustrates users,
          increases support costs, and paradoxically reduces security (users write down passwords, disable
          MFA, or share accounts to avoid friction). The best authentication infrastructure is secure,
          seamless, and invisible to legitimate users while impenetrable to attackers.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding authentication infrastructure requires grasping several foundational concepts about
          identity verification, token management, and protocol design.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authentication Protocols</h3>
        <p>
          OAuth 2.0 is an authorization framework that enables third-party applications to access user
          resources without exposing credentials. OpenID Connect (OIDC) builds on OAuth 2.0 to add
          authentication — it provides an ID token (JWT) that proves the user&apos;s identity. SAML is an
          XML-based protocol primarily used for enterprise single sign-on (SSO). LDAP is a directory protocol
          used for querying and authenticating against directory services like Active Directory. Each protocol
          serves different use cases — OAuth 2.0/OIDC for consumer and API authentication, SAML for enterprise
          SSO, LDAP for internal directory authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Types and Lifecycles</h3>
        <p>
          Access tokens grant access to protected resources. They come in two forms: opaque tokens (random
          strings validated by the authorization server) and self-contained tokens (JWTs that carry claims
          and are validated locally using cryptographic signatures). Refresh tokens are long-lived tokens
          used to obtain new access tokens without re-authentication. ID tokens (OIDC) prove the user&apos;s
          identity and contain claims about the authenticated user.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Factor Authentication</h3>
        <p>
          MFA requires two or more independent authentication factors: something you know (password, PIN),
          something you have (phone, security key, TOTP app), or something you are (fingerprint, face).
          The strongest MFA implementations use phishing-resistant factors (FIDO2/WebAuthn security keys)
          that cannot be intercepted or replayed. SMS-based MFA, while widely deployed, is vulnerable to
          SIM swapping and SS7 attacks and should be considered a fallback, not a primary factor.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Authentication architecture spans the identity provider, authentication flows, token issuance,
          session management, and federation with external identity sources.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/authentication-architecture.svg"
          alt="Authentication Infrastructure Architecture"
          caption="Authentication Architecture — showing OAuth 2.0/OIDC flows, token issuance, and session management"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">OAuth 2.0 / OIDC Authentication Flow</h3>
        <p>
          The authorization code flow with PKCE is the recommended OAuth 2.0 flow for all client types. The
          client redirects the user to the authorization server with a code challenge (PKCE). The user
          authenticates and consents. The authorization server returns an authorization code. The client
          exchanges the code for tokens (access token, refresh token, ID token) using the code verifier
          (PKCE). The client uses the access token to access protected resources. When the access token
          expires, the client uses the refresh token to obtain a new access token without re-authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Validation Architecture</h3>
        <p>
          Access tokens are validated at every API gateway and service boundary. For JWT tokens, validation
          involves verifying the cryptographic signature (using the IdP&apos;s public key), checking the
          expiration time, validating the audience claim (the token was issued for this API), and verifying
          the issuer claim (the token was issued by a trusted IdP). For opaque tokens, validation requires
          a round-trip to the authorization server&apos;s introspection endpoint. JWT validation is faster
          (no network call) but requires key rotation management. Opaque token validation is slower but
          allows instant revocation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/token-lifecycle-management.svg"
          alt="Token Lifecycle Management"
          caption="Token Lifecycle — showing access token, refresh token, and ID token issuance, validation, and rotation"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/mfa-authentication-flow.svg"
          alt="MFA Authentication Flow"
          caption="MFA Authentication — showing multi-factor verification, fallback mechanisms, and phishing-resistant factors"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>JWT Access Tokens</strong></td>
              <td className="p-3">
                No validation round-trip. Stateless validation. Carries claims for authorization decisions.
              </td>
              <td className="p-3">
                Cannot be revoked until expiration. Large token size. Key rotation complexity.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Opaque Access Tokens</strong></td>
              <td className="p-3">
                Instant revocation. Small token size. Server controls all access decisions.
              </td>
              <td className="p-3">
                Validation round-trip on every request. Authorization server becomes bottleneck.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SMS MFA</strong></td>
              <td className="p-3">
                Universal compatibility. No app installation required. Familiar to users.
              </td>
              <td className="p-3">
                Vulnerable to SIM swapping, SS7 attacks. Slow delivery. Not phishing-resistant.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>TOTP MFA</strong></td>
              <td className="p-3">
                Offline capable. No network dependency. Better security than SMS.
              </td>
              <td className="p-3">
                Phishing-vulnerable. Requires app setup. Lost device = locked out.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>FIDO2/WebAuthn</strong></td>
              <td className="p-3">
                Phishing-resistant. No password required. Biometric or hardware key support.
              </td>
              <td className="p-3">
                Limited browser support. Hardware key cost. Backup/recovery complexity.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Authorization Code Flow with PKCE for All Clients</h3>
        <p>
          The authorization code flow with PKCE (Proof Key for Code Exchange) is now the recommended OAuth
          2.0 flow for all client types — including single-page applications and mobile apps. PKCE prevents
          authorization code interception attacks by requiring a code verifier that only the legitimate
          client possesses. The implicit flow (returning tokens directly in the URL) is deprecated and
          should never be used — tokens in URLs are exposed in browser history, server logs, and referrer
          headers.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implement Token Rotation for Refresh Tokens</h3>
        <p>
          Refresh token rotation issues a new refresh token each time the old one is used. If a stolen
          refresh token is used after the legitimate user has already rotated it, the authorization server
          detects the reuse and invalidates all tokens for that session, forcing re-authentication. This
          provides both security (stolen tokens are detected) and operational benefits (compromised sessions
          are automatically terminated).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enforce MFA with Phishing-Resistant Factors</h3>
        <p>
          Require MFA for all user accounts, with FIDO2/WebAuthn security keys as the primary factor.
          TOTP apps (Google Authenticator, Authy) serve as a secondary option for users without security
          keys. SMS should be a last resort — it provides minimal security improvement over passwords
          against targeted attacks. For high-risk operations (payment processing, admin access, data
          export), require step-up authentication with a phishing-resistant factor regardless of the
          primary authentication method.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Centralize Identity Management</h3>
        <p>
          Use a dedicated identity provider (Okta, Auth0, AWS Cognito, or self-hosted Keycloak) rather than
          building authentication from scratch. Authentication infrastructure requires expertise in protocol
          implementation, security auditing, compliance certification, and incident response that is
          difficult to develop in-house. A dedicated IdP provides SSO, MFA, user lifecycle management, and
          compliance reporting out of the box.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Building Custom Authentication from Scratch</h3>
        <p>
          The most common and dangerous pitfall is building custom authentication infrastructure.
          Authentication protocols are subtle — a small implementation error can create catastrophic
          vulnerabilities. OAuth 2.0 has been exploited through redirect URI validation bugs, state
          parameter omission, and token leakage. JWT implementations have been compromised through algorithm
          confusion attacks (accepting unsigned tokens), weak signature verification, and exposed signing
          keys. Use a battle-tested identity provider rather than rolling your own.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storing Tokens Insecurely</h3>
        <p>
          Access tokens and refresh tokens must be stored securely. Storing tokens in localStorage exposes
          them to XSS attacks — any JavaScript on the page can read localStorage and exfiltrate tokens.
          Storing tokens in cookies without security flags (HttpOnly, Secure, SameSite) exposes them to
          CSRF and network interception attacks. The recommended approach: store access tokens in memory
          (JavaScript variables, lost on page refresh), store refresh tokens in HttpOnly, Secure, SameSite
          cookies (inaccessible to JavaScript, protected against CSRF).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Handling Token Expiration Gracefully</h3>
        <p>
          Access tokens should have short lifespans (5-15 minutes) to limit the window of exploitation if
          stolen. However, if the application does not handle token expiration gracefully — automatically
          refreshing tokens in the background, queuing API requests during refresh, and re-authenticating
          when refresh fails — users will experience intermittent authentication failures. Implement a
          token refresh interceptor that catches 401 responses, attempts a silent refresh using the refresh
          token, and retries the original request with the new access token.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Identity Federation</h3>
        <p>
          Modern applications must support multiple identity sources — enterprise SSO (SAML/OIDC), social
          login (Google, Apple, GitHub), and email/password. Building federation support from scratch is
          complex — each identity provider has different protocols, claim formats, and error handling. Use
          an identity provider that supports federation natively (Okta, Auth0) rather than implementing
          multiple protocol integrations yourself. Map external identity claims to a canonical internal
          identity model to avoid vendor lock-in.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Google — Account Security and Passkeys</h3>
        <p>
          Google has pioneered the transition from passwords to passkeys (FIDO2/WebAuthn). Google accounts
          can now authenticate entirely without passwords — users verify identity through device biometrics
          (fingerprint, face recognition) or device PIN. The passkey is stored in the device&apos;s secure
          enclave and never leaves the device, making it immune to phishing, credential stuffing, and
          database breach attacks. Google&apos;s authentication infrastructure handles billions of
          authentications per day with sub-200ms latency, using a globally distributed identity provider
          with automatic failover across regions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Okta — Enterprise Identity Federation</h3>
        <p>
          Okta serves as the identity provider for over 100,000 organizations, federating authentication
          across hundreds of applications. Okta&apos;s architecture supports multiple protocols (SAML, OIDC,
          SCIM, WS-Federation) and integrates with hundreds of identity sources (Active Directory, LDAP,
          HR systems). Their authentication pipeline evaluates risk signals (geographic anomaly, device
          posture, behavioral biometrics) and applies adaptive MFA — requiring additional factors only when
          risk is elevated. This balances security and user experience — legitimate users authenticate
          seamlessly while anomalous logins face additional scrutiny.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — API Authentication at Scale</h3>
        <p>
          Stripe&apos;s API authentication uses API keys (secret keys for server-side operations, publishable
          keys for client-side operations) with scoped permissions. Each API key has a specific scope
          (read-only, write access, specific resource access) and can be rotated without downtime using
          key pairs — the old key remains active while the new key is being adopted. Stripe&apos;s
          authentication infrastructure validates every API request in under 10ms, using a globally
          distributed key validation service that checks key validity, scope, rate limits, and IP
          restrictions before forwarding the request to the appropriate service.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Apple — Sign in with Apple</h3>
        <p>
          Apple&apos;s &quot;Sign in with Apple&quot; provides an OIDC-compliant authentication flow that
          emphasizes user privacy. Unlike other social login providers, Apple does not track user activity
          across apps and websites. It supports private email relay — Apple generates a unique email address
          for each app, forwarding emails to the user&apos;s real address while protecting their identity.
          Apple requires all iOS apps that offer third-party login to also offer Sign in with Apple, making
          it a mandatory authentication option for millions of applications.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Authentication infrastructure is the primary target for attackers — compromising authentication grants access to all user data and actions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Attack Vectors</h3>
          <ul className="space-y-2">
            <li>
              <strong>Credential Stuffing:</strong> Attackers use breached credential databases to automate login attempts. Mitigation: implement rate limiting per account, detect and block automated login patterns, require CAPTCHA after failed attempts, offer passwordless authentication.
            </li>
            <li>
              <strong>Token Theft:</strong> Access tokens stolen via XSS, network interception, or insecure storage. Mitigation: use short-lived access tokens (5-15 min), store tokens securely (HttpOnly cookies for refresh tokens, memory for access tokens), implement token binding to prevent replay across different clients.
            </li>
            <li>
              <strong>Phishing:</strong> Fake login pages that capture credentials. Mitigation: use FIDO2/WebAuthn (phishing-resistant), implement domain-bound authentication (passkeys are bound to the legitimate domain), educate users about phishing indicators, monitor for lookalike domains.
            </li>
            <li>
              <strong>OAuth Authorization Code Interception:</strong> Attackers intercept authorization codes during the redirect. Mitigation: always use PKCE (Proof Key for Code Exchange), validate redirect URIs against allowlists, use state parameters to prevent CSRF attacks on the OAuth flow.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Identity Federation Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>IdP Compromise:</strong> If the identity provider is compromised, all federated applications are affected. Mitigation: monitor IdP health, implement backup authentication methods, maintain local account recovery procedures, require MFA for IdP admin access.
            </li>
            <li>
              <strong>Claim Manipulation:</strong> Attackers modify identity claims in transit or at the IdP. Mitigation: validate all claims against expected formats, use signed tokens (JWT with verified signatures), verify issuer and audience claims, implement claim transformation pipelines.
            </li>
            <li>
              <strong>Account Takeover via Federation:</strong> Attackers link their social identity to an existing account by exploiting email matching. Mitigation: require re-authentication before linking identities, verify email ownership before account merge, implement account recovery procedures that do not rely solely on email.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Session Fixation:</strong> Attackers set a known session ID before the user authenticates. Mitigation: regenerate session ID after authentication, use secure session management libraries, invalidate sessions on privilege changes.
            </li>
            <li>
              <strong>Concurrent Session Abuse:</strong> Users share accounts by sharing session tokens. Mitigation: detect concurrent sessions from different locations/devices, limit concurrent sessions per account, alert users to unexpected sessions, offer session management UI for users to review and terminate sessions.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Authentication infrastructure must be validated through systematic testing — security vulnerabilities, protocol compliance, and failure handling must all be verified.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Testing Suite</h3>
          <ul className="space-y-2">
            <li>
              <strong>Protocol Conformance Tests:</strong> Verify OAuth 2.0 / OIDC flows execute correctly — authorization code exchange, token refresh, token revocation, and PKCE validation. Test with standard OAuth testing tools (OAuth.tools, oidc-tester). Verify that all required parameters are validated and invalid requests are rejected.
            </li>
            <li>
              <strong>Token Validation Tests:</strong> Test JWT signature verification with valid, invalid, and expired tokens. Verify audience and issuer claim validation. Test opaque token introspection with valid, revoked, and expired tokens. Verify that invalid tokens are rejected with appropriate 401 responses.
            </li>
            <li>
              <strong>MFA Enforcement Tests:</strong> Verify that MFA is enforced for all accounts. Test MFA bypass attempts (skipping MFA step, using expired MFA codes, replaying MFA codes). Test MFA fallback behavior when the primary factor is unavailable. Verify step-up authentication for high-risk operations.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Penetration Testing:</strong> Engage professional penetration testers to test authentication flows for vulnerabilities — credential stuffing resistance, token theft scenarios, OAuth flow manipulation, and session fixation. Run penetration tests quarterly and after major authentication changes.
            </li>
            <li>
              <strong>Attack Simulation:</strong> Simulate credential stuffing attacks using known breached credentials. Verify that rate limiting, account lockout, and MFA challenges activate as expected. Simulate phishing attacks to verify that FIDO2 passkeys resist credential harvesting.
            </li>
            <li>
              <strong>Token Lifecycle Testing:</strong> Test the full token lifecycle — issuance, validation, refresh, rotation, and revocation. Verify that revoked tokens are immediately rejected, that refresh token rotation detects reuse, and that token expiration is enforced correctly.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ OAuth 2.0 authorization code flow with PKCE implemented for all client types</li>
            <li>✓ MFA enforced for all accounts with phishing-resistant primary factor (FIDO2)</li>
            <li>✓ Access tokens short-lived (5-15 min), refresh tokens rotated and securely stored</li>
            <li>✓ Token validation enforces signature, expiration, audience, and issuer claims</li>
            <li>✓ Rate limiting configured for login attempts, token requests, and password resets</li>
            <li>✓ Identity federation configured for all required identity sources (enterprise, social)</li>
            <li>✓ Session management supports concurrent session review and termination</li>
            <li>✓ Account recovery procedures tested and documented (no email-only recovery)</li>
            <li>✓ Authentication monitoring configured (failed login alerts, anomaly detection)</li>
            <li>✓ Incident response plan documented for authentication compromise scenarios</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://oauth.net/2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OAuth 2.0 Specification (RFC 6749)
            </a>
          </li>
          <li>
            <a href="https://openid.net/connect/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenID Connect Core Specification
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/webauthn-2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Web Authentication (WebAuthn) Level 2 — FIDO2
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP — Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://www.okta.com/identity-101/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Okta — Identity 101 Guide
            </a>
          </li>
          <li>
            <a href="https://auth0.com/blog/oauth2-implicit-grant/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0 — Why OAuth Implicit Flow is Deprecated
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
