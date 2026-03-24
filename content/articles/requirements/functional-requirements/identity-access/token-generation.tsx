"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-token-generation",
  title: "Token Generation",
  description:
    "Comprehensive guide to implementing token generation covering JWT structure, signing algorithms (RS256, HS256), refresh tokens, token rotation, token revocation, key management, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "token-generation",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "tokens",
    "jwt",
    "backend",
    "security",
    "authentication",
  ],
  relatedTopics: ["authentication-service", "session-management", "oauth-providers"],
};

export default function TokenGenerationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Token Generation</strong> is the process of creating cryptographic tokens (JWT,
          opaque tokens) that represent authenticated user sessions. Tokens enable stateless
          authentication, API authorization, and secure session management across distributed
          systems. Token generation is the foundation of modern authentication — without secure
          tokens, sessions can be hijacked, identities forged, and APIs compromised.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-generation-flow.svg"
          alt="Token Generation Flow"
          caption="Token Generation Flow — showing JWT creation, signing, claims, and delivery to client"
        />

        <p>
          For staff and principal engineers, implementing token generation requires deep
          understanding of JWT structure (header, payload, signature), signing algorithms (RS256,
          HS256, ES256), token lifecycle management (generation, validation, refresh, revocation),
          refresh token rotation, security best practices (short expiry, minimal claims, secure
          storage), and scaling token validation across services. The implementation must balance
          security (short expiry, rotation) with usability (seamless refresh, long sessions).
        </p>
        <p>
          Modern token generation has evolved from simple session IDs to sophisticated JWT-based
          systems with refresh token rotation, token binding, and key rotation. Organizations like
          Google, Microsoft, and Auth0 handle billions of token operations daily while maintaining
          security through short-lived access tokens, rotating refresh tokens, and automated key
          rotation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Token generation is built on fundamental concepts that determine how tokens are created,
          validated, and managed. Understanding these concepts is essential for designing effective
          token systems.
        </p>
        <p>
          <strong>Access Tokens (JWT):</strong> Short-lived token (15-60 minutes) for API
          authorization. JWT format with header (alg, typ, kid), payload (claims: sub, exp, iat,
          aud, iss, roles), signature (RS256 signed). Carries user identity and permissions. Stored
          in client memory (not localStorage), sent via Authorization: Bearer header. Stateless
          validation — any service can validate without database lookup.
        </p>
        <p>
          <strong>Refresh Tokens:</strong> Long-lived token (7-30 days) for obtaining new access
          tokens. Opaque format (random 256-bit value), stored server-side (hash in database).
          Enables extended sessions without long-lived access tokens. Stored in HttpOnly, Secure,
          SameSite cookie (XSS-proof). Rotated on each use — issue new, invalidate old, detect
          reuse attacks.
        </p>
        <p>
          <strong>ID Tokens (OIDC):</strong> Identity assertion for OIDC flows. JWT with standard
          claims (sub, name, email, picture, locale). Client consumes for user info, not for API
          authorization. Separate from access tokens — different purpose, different audience.
        </p>
        <p>
          <strong>Signing Algorithms:</strong> RS256 (asymmetric, recommended for distributed
          systems — public key distributed via JWKS, private key secure), HS256 (symmetric, simpler
          but secret must be shared), ES256 (elliptic curve, smaller signatures, faster than RSA).
          Key management critical — store private keys in HSM/vault, rotate periodically (90 days).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Token generation architecture separates token creation from validation, enabling
          distributed validation with centralized key management. This architecture is critical for
          scaling authentication across microservices.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/jwt-structure.svg"
          alt="JWT Structure"
          caption="JWT Structure — showing header (alg, typ, kid), payload (claims), signature with RS256 signing"
        />

        <p>
          Token generation flow: User authenticates successfully (password, MFA). Backend generates
          JWT access token — create header (alg: RS256, typ: JWT, kid: key-id), create payload (sub:
          user-id, exp: now+15min, iat: now, aud: api-audience, iss: auth-service, roles:
          ["user"]), sign with private key (RS256). Generate refresh token — random 256-bit value,
          store hash in database with user_id, expiry, device metadata. Return tokens to client —
          access token in response body, refresh token in HttpOnly cookie.
        </p>
        <p>
          Token validation flow: Client sends request with Authorization: Bearer {'{'}token{'}'}. Service
          extracts token, validates signature (using cached public key from JWKS), checks expiry
          (exp claim), validates issuer (iss) and audience (aud), extracts claims for
          authorization. Cache validation results to reduce JWKS lookups. For high-security: check
          token denylist (JTI), validate token binding (device fingerprint).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-security.svg"
          alt="Token Security"
          caption="Token Security — showing signing algorithms comparison, key rotation, token revocation, and denial list"
        />

        <p>
          Key rotation architecture: JWKS endpoint with multiple keys identified by kid (key ID).
          Sign with current key, validate with any valid key. Rotation process: (1) Generate new
          key pair, (2) Add to JWKS with new kid, (3) Update signers to use new key, (4) Keep old
          key in JWKS until all tokens signed with it expire, (5) Remove old key. Zero downtime, no
          invalidation of existing tokens.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing token generation involves trade-offs between security, performance, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">RS256 vs HS256 vs ES256</h3>
          <ul className="space-y-3">
            <li>
              <strong>RS256:</strong> Asymmetric (public/private key pair), distributed validation
              (any service can validate), easy key rotation. Limitation: more complex key
              management, slower than symmetric.
            </li>
            <li>
              <strong>HS256:</strong> Symmetric (shared secret), simpler, faster. Limitation:
              secret must be shared with all validators, harder to rotate, single point of
              compromise.
            </li>
            <li>
              <strong>ES256:</strong> Elliptic curve, smaller signatures, faster than RSA.
              Limitation: less widely supported, more complex implementation.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Short vs Long Token Expiry</h3>
          <ul className="space-y-3">
            <li>
              <strong>Short (15-60 min):</strong> Limits exposure window if token stolen, more
              secure. Limitation: more frequent refresh, potential UX friction.
            </li>
            <li>
              <strong>Long (4-24 hours):</strong> Better UX (less refresh), simpler. Limitation:
              longer exposure window if token compromised.
            </li>
            <li>
              <strong>Recommendation:</strong> Short access tokens (15-60 min) + long refresh
              tokens (7-30 days). Best of both — security with seamless UX.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">JWT vs Opaque Tokens</h3>
          <ul className="space-y-3">
            <li>
              <strong>JWT:</strong> Stateless validation (no database lookup), fast, scalable.
              Limitation: can't revoke immediately (must wait for expiry), larger token size.
            </li>
            <li>
              <strong>Opaque:</strong> Immediate revocation (delete from database), smaller token
              size. Limitation: requires database lookup on every request, slower.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — JWT access tokens (short expiry) + opaque
              refresh tokens (revocable). Best of both worlds.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing token generation requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use RS256 for distributed systems — asymmetric keys, easy rotation. Keep access token
          expiry short (15-60 minutes) — limit exposure window. Implement refresh token rotation —
          issue new on each use, invalidate old, detect reuse attacks. Rotate signing keys
          periodically (90 days) — JWKS with multiple keys. Store private keys in HSM/vault —
          never in code or config files.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Design</h3>
        <p>
          Include minimal claims (sub, exp, iat, iss, aud) — keep tokens small. Avoid sensitive
          data in payload — JWT is encoded, not encrypted. Use JTI for token tracking — unique
          identifier for revocation. Include kid for key rotation — identifies signing key. Keep
          token size under HTTP header limits (~8KB).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Storage</h3>
        <p>
          Store access tokens in memory (not localStorage) — prevent XSS theft. Use HttpOnly
          cookies for refresh tokens — XSS-proof, CSRF-protected. Send access tokens via
          Authorization header — standard, secure. Never expose tokens in URLs — logged in server
          logs, browser history. Clear tokens on logout — remove from memory, delete cookies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <p>
          Track token generation rates — baseline normal, alert on anomalies. Monitor token
          validation failures — detect attacks (tampered tokens). Alert on unusual token patterns —
          token reuse, unusual locations. Track refresh token rotation — ensure rotation working.
          Monitor key rotation schedule — alert before key expiry.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing token generation to ensure secure, usable,
          and maintainable token systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Long access token expiry:</strong> Stolen tokens valid for too long, extended
            exposure. <strong>Fix:</strong> Short expiry (15-60 min), use refresh tokens for
            session extension.
          </li>
          <li>
            <strong>No token rotation:</strong> Refresh tokens valid indefinitely, stolen tokens
            usable forever. <strong>Fix:</strong> Rotate refresh tokens on each use. Invalidate
            old. Detect reuse attacks.
          </li>
          <li>
            <strong>Sensitive data in JWT:</strong> PII exposed if token intercepted, JWT is
            encoded not encrypted. <strong>Fix:</strong> Minimal claims, no sensitive data. Use
            references not full data.
          </li>
          <li>
            <strong>Storing tokens in localStorage:</strong> XSS can steal tokens, full account
            compromise. <strong>Fix:</strong> Memory for access tokens, HttpOnly cookies for
            refresh.
          </li>
          <li>
            <strong>No key rotation:</strong> Compromised keys remain valid indefinitely.{" "}
            <strong>Fix:</strong> Rotate keys every 90 days. Support multiple keys during
            transition.
          </li>
          <li>
            <strong>Weak signing algorithm:</strong> HS256 with weak secret, brute force attacks.{" "}
            <strong>Fix:</strong> Use RS256 or ES256. Strong keys (2048+ bit RSA, 256-bit EC).
          </li>
          <li>
            <strong>No token validation:</strong> Accepting invalid tokens, security bypass.{" "}
            <strong>Fix:</strong> Validate signature, expiry, issuer, audience. Check denylist for
            high-security.
          </li>
          <li>
            <strong>Large tokens:</strong> Exceeds HTTP header limits (~8KB), request failures.{" "}
            <strong>Fix:</strong> Minimal claims, use references not full data. Compress if needed.
          </li>
          <li>
            <strong>No revocation mechanism:</strong> Can't revoke compromised tokens.{" "}
            <strong>Fix:</strong> Short expiry, denylist for JTI, version claims, opaque tokens for
            revocable sessions.
          </li>
          <li>
            <strong>Token reuse:</strong> Same refresh token used multiple times, indicates theft.{" "}
            <strong>Fix:</strong> Detect reuse, revoke entire family (all sessions). Alert security
            team.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Token generation is critical for platform security. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, diverse services. Need stateless
          validation across services. Key rotation without downtime.
        </p>
        <p>
          <strong>Solution:</strong> JWT access tokens (1 hour expiry), opaque refresh tokens
          (rotated). JWKS for public key distribution. Automated key rotation (90 days). Token
          binding to device fingerprint.
        </p>
        <p>
          <strong>Result:</strong> Stateless validation across all Google services. Zero downtime
          key rotation. Token theft detected via binding.
        </p>
        <p>
          <strong>Security:</strong> RS256 signing, short expiry, token rotation, key rotation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require compliance. Token revocation for
          terminated employees. Audit trails for compliance.
        </p>
        <p>
          <strong>Solution:</strong> JWT access tokens with JTI for revocation. Denylist in Redis
          for immediate revocation. Refresh token rotation. Audit logging for all token operations.
        </p>
        <p>
          <strong>Result:</strong> Immediate revocation on employee termination. Passed SOC 2
          audit. Compliance requirements met.
        </p>
        <p>
          <strong>Security:</strong> Token revocation, refresh rotation, audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires strong token security. High-value
          transactions need enhanced token binding.
        </p>
        <p>
          <strong>Solution:</strong> Short-lived access tokens (15 min). Token binding to device
          fingerprint. Refresh token rotation with reuse detection. Step-up authentication for
          high-value transactions.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Token theft detected via binding. Fraud
          reduced 90%.
        </p>
        <p>
          <strong>Security:</strong> Token binding, short expiry, reuse detection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires access controls. Provider sessions
          need automatic timeout. Audit trails for PHI access.
        </p>
        <p>
          <strong>Solution:</strong> JWT with role claims (provider, admin). Short session timeout
          (15 min idle). Token includes facility ID for access control. Audit logging for all token
          use.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Automatic session timeout. PHI access
          logged.
        </p>
        <p>
          <strong>Security:</strong> Role-based tokens, session timeout, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M+ users, high account takeover rate. Token theft for
          valuable items. Young users without phones.
        </p>
        <p>
          <strong>Solution:</strong> JWT access tokens with game-specific claims. Refresh token
          rotation. Token binding to device. Parental controls via token claims.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 85%. Token theft detected via binding.
        </p>
        <p>
          <strong>Security:</strong> Token binding, refresh rotation, parental controls.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of token generation design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What claims should you include in JWT?</p>
            <p className="mt-2 text-sm">
              A: Minimum: sub (user ID), exp (expiry), iat (issued at), iss (issuer), aud
              (audience). Optional: roles, permissions (for simple apps). Avoid: sensitive data
              (password, PII), large data (keep token small). Keep claims minimal — token size
              affects performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement token rotation?</p>
            <p className="mt-2 text-sm">
              A: Generate new refresh token on each refresh request. Invalidate old token (delete
              from database). Store family chain (detect reuse — if old token used, revoke entire
              family). Issue new access token with new refresh token. This prevents stolen refresh
              tokens from being usable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle JWT key rotation?</p>
            <p className="mt-2 text-sm">
              A: JWKS endpoint with multiple keys identified by kid (key ID). Sign with current
              key, validate with any valid key. Rotation process: (1) Generate new key pair. (2)
              Add to JWKS with new kid. (3) Update signers to use new key. (4) Keep old key in
              JWKS until all tokens signed with it expire. (5) Remove old key. Zero downtime, no
              invalidation of existing tokens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store permissions in JWT?</p>
            <p className="mt-2 text-sm">
              A: For simple apps: yes (reduces DB lookups, fast validation). For complex/dynamic
              permissions: no (permissions change, token stale until refresh). Hybrid approach:
              store roles in JWT, fetch permissions per-request. Best: store minimal claims,
              authorize based on roles fetched from database.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you revoke JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: Can't revoke directly (stateless). Solutions: (1) Short expiry — wait for natural
              expiry. (2) Denylist — store JTI in Redis until expiry, check on validation. (3)
              Version claim — include version in token, increment on revoke, check in token. (4)
              Opaque tokens for revocable sessions — delete from database.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token size limits?</p>
            <p className="mt-2 text-sm">
              A: Keep claims minimal — only essential data. Avoid large data — use references (role
              IDs not names). Compress if needed (rarely necessary). HTTP headers have limits
              (~8KB). If token too large, use opaque tokens with server-side lookup instead of JWT.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent token theft?</p>
            <p className="mt-2 text-sm">
              A: Use HttpOnly cookies for refresh tokens — XSS-proof. Store access tokens in
              memory — not localStorage. Use HTTPS only — prevent interception. Implement token
              binding to device — detect theft (if used from different device). Monitor for unusual
              token usage. Short token expiry — limit exposure window.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for tokens?</p>
            <p className="mt-2 text-sm">
              A: Token generation rate, validation success/failure rate, refresh token rotation
              rate, key rotation schedule compliance, token reuse detection rate. Security: failed
              validation attempts (tampering), token reuse attempts (theft). Set up alerts for
              anomalies — spike in failures (attack), unusual patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token validation at scale?</p>
            <p className="mt-2 text-sm">
              A: Cache public keys (JWKS) — reduce lookups. Use edge validation (CDN) — validate at
              edge. Batch validation for multiple tokens. Implement token introspection caching.
              Scale validation horizontally — stateless JWT validation. For high-throughput: use
              ES256 (faster than RS256).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc7519"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7519 - JSON Web Token (JWT)
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc6749"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 6749 - OAuth 2.0 Authorization Framework
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
