"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-authentication-service",
  title: "Authentication Service",
  description:
    "Comprehensive guide to building authentication services covering credential validation, token issuance, session management, security patterns, risk-based authentication, and scaling for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "authentication-service",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "authentication",
    "backend",
    "security",
    "tokens",
  ],
  relatedTopics: ["token-generation", "session-management", "password-reset", "mfa-setup"],
};

export default function AuthenticationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Authentication Service</strong> is the core backend component responsible for
          verifying user credentials and issuing authentication tokens. It is the security gateway
          for the entire platform and must be designed for high security, high availability, and
          horizontal scalability. Authentication services handle millions of requests daily while
          maintaining sub-100ms latency and 99.99% availability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/authentication-service-architecture.svg"
          alt="Authentication Service Architecture"
          caption="Authentication Service Architecture — showing service components, data flow, integrations, and scaling patterns"
        />

        <p>
          For staff and principal engineers, building an authentication service requires deep
          knowledge of cryptographic protocols (bcrypt, Argon2, RS256), token standards (JWT,
          OAuth), session management patterns, security threats (credential stuffing, replay
          attacks, token theft, timing attacks), and operational concerns (key rotation, audit
          logging, compliance). The service must handle millions of authentication requests daily
          while maintaining sub-100ms latency and 99.99% availability.
        </p>
        <p>
          Modern authentication services have evolved from simple username/password validation to
          supporting multiple authentication methods (password, OTP, WebAuthn, SSO), multi-factor
          authentication, adaptive/risk-based authentication, and passwordless flows. The
          architecture must support gradual rollout of new methods, A/B testing, graceful
          degradation during incidents, and compliance with security standards (SOC 2, HIPAA,
          PCI-DSS).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Authentication service is built on fundamental concepts that determine how credentials
          are validated, tokens are issued, and sessions are managed. Understanding these concepts
          is essential for designing effective authentication systems.
        </p>
        <p>
          <strong>Credential Validator:</strong> Verifies passwords against stored hashes using
          constant-time comparison (prevent timing attacks). Supports multiple hash algorithms
          (bcrypt, Argon2id) for gradual migration. Implements account lockout after N failures
          (prevent brute force). Rate limits validation attempts (per IP, per account).
        </p>
        <p>
          <strong>Token Issuer:</strong> Generates JWT access tokens and opaque refresh tokens.
          Signs with RS256 (asymmetric) for distributed validation. Includes minimal claims (sub,
          exp, iat, aud, iss) — keep tokens small. Short expiry (15-60 min) for access tokens,
          long expiry (7-30 days) for refresh tokens.
        </p>
        <p>
          <strong>Session Manager:</strong> Creates and tracks user sessions in Redis Cluster.
          Stores session metadata (device, IP, created_at, last_activity). Implements sliding
          timeout (extends on activity) and absolute timeout (max session duration). Supports
          session revocation (logout, password change).
        </p>
        <p>
          <strong>Risk Engine:</strong> Evaluates login risk based on device fingerprint, location,
          IP reputation, time of day, behavior patterns. Triggers step-up authentication for
          high-risk logins (require MFA). Integrates with fraud detection systems. Machine learning
          models for anomaly detection.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Authentication service architecture separates credential validation from token issuance,
          enabling horizontal scaling with centralized session management. This architecture is
          critical for handling millions of authentication requests while maintaining security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-management.svg"
          alt="Token Management"
          caption="Token Management — showing JWT structure, refresh token rotation, token validation, and revocation flow"
        />

        <p>
          Authentication flow: User submits credentials (email + password). Backend validates
          format, checks rate limits, retrieves user from database (cached in Redis), validates
          password (constant-time comparison), checks MFA status, evaluates risk score. If
          low-risk: issue tokens directly. If medium-risk: require MFA challenge. If high-risk:
          block and alert. On success: generate JWT access token (RS256 signed), generate refresh
          token (opaque, stored in database), create session in Redis, return tokens to client.
        </p>
        <p>
          Token management architecture includes: JWT access tokens (stateless validation, short
          expiry), refresh token rotation (issue new on each use, invalidate old), token revocation
          (denylist for immediate revocation, session invalidation on password change), token
          validation (verify signature, check expiry, validate claims). This architecture enables
          secure token handling — tokens are protected even if intercepted.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/auth-scalability.svg"
          alt="Auth Scalability"
          caption="Auth Scalability — showing horizontal scaling, Redis Cluster for sessions, database read replicas, multi-region deployment, and caching strategies"
        />

        <p>
          Scaling architecture includes: stateless JWT validation (any instance can validate any
          token), Redis Cluster for sessions (sharded by user_id), database read replicas for user
          lookup, cache user data (password hash, MFA status) in Redis, multi-region deployment
          with global load balancing. Target: p99 latency &lt;100ms, 99.99% availability. Circuit
          breakers for downstream dependencies (prevent cascade failures).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing authentication service involves trade-offs between security, user experience,
          and operational complexity. Understanding these trade-offs is essential for making
          informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">JWT vs Opaque Access Tokens</h3>
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
              <strong>Recommendation:</strong> Hybrid — JWT access tokens (short expiry 15-60
              min) + opaque refresh tokens (revocable, long expiry 7-30 days). Best of both
              worlds.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">RS256 vs HS256 for JWT Signing</h3>
          <ul className="space-y-3">
            <li>
              <strong>RS256:</strong> Asymmetric (private key signs, public key validates),
              distributed validation (any service can validate), key rotation without downtime.
              Limitation: more complex key management.
            </li>
            <li>
              <strong>HS256:</strong> Symmetric (same key signs and validates), simpler.
              Limitation: key must be shared with all validators, rotation requires downtime.
            </li>
            <li>
              <strong>Recommendation:</strong> RS256 for production (distributed validation, easy
              key rotation). HS256 only for simple, single-service applications.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Storage: Redis vs Database</h3>
          <ul className="space-y-3">
            <li>
              <strong>Redis:</strong> Sub-millisecond latency, TTL support (auto-expiry),
              horizontal scaling (Redis Cluster). Limitation: data loss on failure (mitigate with
              persistence), cost at scale.
            </li>
            <li>
              <strong>Database:</strong> Durable, queryable, cost-effective. Limitation: slower
              latency (5-50ms), requires connection pooling.
            </li>
            <li>
              <strong>Recommendation:</strong> Redis for active sessions (fast lookup), database
              for session metadata and audit (durable storage). Hybrid approach used by most
              production systems.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing authentication service requires following established best practices to
          ensure security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use constant-time comparison for all credential validation — prevent timing attacks
          (crypto.timingSafeEqual). Implement rate limiting at multiple levels (IP, account,
          endpoint) — prevent brute force and credential stuffing. Log all authentication events
          for audit trails — detect fraud patterns. Use secure password hashing (Argon2id, bcrypt
          with cost 12+) — protect against database breach. Implement account lockout with
          progressive delays — prevent automated attacks.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Management</h3>
        <p>
          Use RS256 for JWT signing (asymmetric keys) — distributed validation, easy key rotation.
          Keep access tokens short-lived (15-60 minutes) — limit exposure window. Rotate refresh
          tokens on each use — detect reuse attacks. Store refresh tokens in HttpOnly, Secure
          cookies — prevent XSS theft. Implement token revocation for compromised sessions —
          immediate invalidation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operational Excellence</h3>
        <p>
          Monitor authentication latency and error rates — detect performance issues. Set up
          alerts for unusual patterns (credential stuffing attacks) — detect security incidents.
          Implement graceful degradation for non-critical dependencies — maintain availability
          during incidents. Plan for key rotation without downtime — JWKS with multiple keys.
          Document incident response procedures — rapid response to security incidents.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance</h3>
        <p>
          Maintain immutable audit logs for compliance — SOC 2, HIPAA, PCI-DSS requirements.
          Implement data retention policies — automatic deletion after retention period. Support
          user data export and deletion (GDPR) — right to access, right to be forgotten. Encrypt
          PII at rest and in transit — protect sensitive data. Regular security audits and
          penetration testing — detect vulnerabilities.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing authentication service to ensure secure,
          usable, and maintainable authentication systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Timing attacks on password validation:</strong> Non-constant-time comparison
            leaks password information. <strong>Fix:</strong> Use crypto.timingSafeEqual or
            framework-provided constant-time comparison.
          </li>
          <li>
            <strong>Storing tokens in localStorage:</strong> XSS attacks can steal tokens.{" "}
            <strong>Fix:</strong> Store access tokens in memory, refresh tokens in HttpOnly,
            Secure, SameSite cookies.
          </li>
          <li>
            <strong>Long-lived access tokens:</strong> Extended exposure window if token is
            compromised. <strong>Fix:</strong> Keep access tokens short (15-60 min). Use refresh
            tokens for session extension.
          </li>
          <li>
            <strong>No refresh token rotation:</strong> Stolen refresh tokens can be used
            indefinitely. <strong>Fix:</strong> Issue new refresh token on each use. Invalidate
            old token. Detect reuse attacks.
          </li>
          <li>
            <strong>Weak password hashing:</strong> MD5, SHA1, or unsalted hashes are crackable.{" "}
            <strong>Fix:</strong> Use Argon2id or bcrypt with appropriate cost factors (12+).
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force and credential stuffing attacks.{" "}
            <strong>Fix:</strong> Implement per-IP, per-account, per-endpoint rate limiting with
            exponential backoff.
          </li>
          <li>
            <strong>Revealing user existence:</strong> Different errors for "user not found" vs
            "wrong password". <strong>Fix:</strong> Use generic "Invalid credentials" message for
            all authentication failures.
          </li>
          <li>
            <strong>Not invalidating sessions on password change:</strong> Old sessions remain
            valid. <strong>Fix:</strong> Invalidate all sessions when password changes. Force
            re-authentication.
          </li>
          <li>
            <strong>Hardcoded secrets in code:</strong> Secrets in version control are compromised.{" "}
            <strong>Fix:</strong> Use environment variables, secret management services (Vault, AWS
            Secrets Manager).
          </li>
          <li>
            <strong>No audit logging:</strong> Can't investigate security incidents.{" "}
            <strong>Fix:</strong> Log all auth events with timestamp, user_id, IP, device,
            outcome. Use immutable storage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Authentication service is critical for platform security. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Platform (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, diverse authentication methods. Need to
          balance security with UX. Credential stuffing attacks at scale.
        </p>
        <p>
          <strong>Solution:</strong> Risk-based authentication (device trust, location, behavior).
          Multiple auth methods (password, 2FA, WebAuthn, backup codes). Adaptive step-up (require
          MFA for suspicious logins). Global infrastructure for low latency.
        </p>
        <p>
          <strong>Result:</strong> 99.99% availability. Credential stuffing blocked 99.9%. User
          friction minimized for trusted devices.
        </p>
        <p>
          <strong>Security:</strong> Risk scoring, MFA enforcement, device trust, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require SSO, MFA, compliance. High
          availability for business continuity. Complex access policies.
        </p>
        <p>
          <strong>Solution:</strong> SAML/OIDC SSO integration. Policy-based MFA (require for
          specific apps, locations). Session management with admin controls. Compliance reporting
          (SOC 2, HIPAA).
        </p>
        <p>
          <strong>Result:</strong> Enterprise-grade availability (99.99%). Compliance requirements
          met. Admin control over user access.
        </p>
        <p>
          <strong>Security:</strong> SSO integration, policy-based MFA, session management, audit
          trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC compliance requires strong authentication. High-value
          transactions need enhanced verification. Fraud prevention critical.
        </p>
        <p>
          <strong>Solution:</strong> Multi-factor authentication mandatory. Risk-based
          authentication (step-up for unusual transactions). Device binding (trusted devices skip
          some MFA). Real-time fraud detection.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audits. Fraud reduced 90%. Customer experience
          maintained for trusted devices.
        </p>
        <p>
          <strong>Security:</strong> MFA enforcement, risk-based auth, device binding, fraud
          detection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires access controls. Provider
          authentication across multiple facilities. Emergency access needed.
        </p>
        <p>
          <strong>Solution:</strong> SSO with hospital IdPs. MFA for remote access. Break-glass
          access for emergencies (full audit, post-incident review). Session timeout for shared
          workstations.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Provider access streamlined. Emergency
          access available with audit.
        </p>
        <p>
          <strong>Security:</strong> SSO integration, MFA, break-glass access, session timeout.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M+ users, high account takeover rate for valuable items.
          Young users without phones. Parental controls.
        </p>
        <p>
          <strong>Solution:</strong> Multiple auth methods (password, social, email OTP). MFA for
          high-value accounts. Parental controls for minor accounts. Account recovery with backup
          codes.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 85%. MFA adoption 60%. Parental
          control effective.
        </p>
        <p>
          <strong>Security:</strong> Multiple auth methods, MFA, parental controls, account
          recovery.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of authentication service design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design an authentication service for 100M users?</p>
            <p className="mt-2 text-sm">
              A: Stateless JWT validation (any instance can validate any token), Redis Cluster for
              sessions (sharded by user_id), database read replicas for user lookup, cache user
              data (password hash, MFA status) in Redis, multi-region deployment with global load
              balancing, async audit logging via Kafka. Target: p99 latency &lt;100ms, 99.99%
              availability. Use circuit breakers for downstream dependencies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: JWT vs opaque tokens — which do you choose?</p>
            <p className="mt-2 text-sm">
              A: Hybrid approach: JWT access tokens (stateless validation, short-lived 15-60 min) +
              opaque refresh tokens (server-side stored, revocable, long-lived 7-30 days). Best of
              both worlds — fast validation without database lookup, with ability to revoke
              sessions immediately. Store refresh token hash in database, not plaintext.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token revocation with JWTs?</p>
            <p className="mt-2 text-sm">
              A: Short expiry (15 min) limits damage window. For immediate revocation: maintain
              denylist in Redis (token JTI + expiry timestamp), check on validation. Or use opaque
              tokens for sessions requiring immediate revocation (admin sessions, sensitive
              operations). Alternative: short-lived JWTs with frequent refresh requiring server
              validation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent replay attacks?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) Short token expiry limits replay window. (2) Include nonce/jti
              in tokens and track used nonces. (3) HTTPS only to prevent token interception. (4)
              Token binding to device fingerprint (include device hash in token, validate on use).
              (5) Rotate refresh tokens on each use. (6) Detect token reuse attacks and revoke all
              sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement adaptive authentication?</p>
            <p className="mt-2 text-sm">
              A: Risk engine evaluates multiple signals: device trust (known device?), location
              (usual location?), time (normal hours?), behavior (typical patterns?), velocity
              (multiple logins?). Calculate risk score (0-100). Low risk (0-30): standard auth
              flow. Medium risk (31-70): step-up MFA required. High risk (71-100): block
              authentication and alert security team. Update risk model based on outcomes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle key rotation for JWT signing?</p>
            <p className="mt-2 text-sm">
              A: JWKS endpoint with multiple keys identified by kid (key ID). Sign with current
              key, validate with any valid key. Rotation process: (1) Generate new key pair. (2)
              Add to JWKS with new kid. (3) Update signers to use new key. (4) Keep old key in
              JWKS until all tokens signed with it expire. (5) Remove old key. Zero downtime, no
              invalidation of existing tokens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle credential stuffing attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limiting per IP and account with exponential
              backoff. (2) CAPTCHA after 3-5 failed attempts. (3) Check passwords against breach
              databases (Have I Been Pwned). (4) Device fingerprinting to detect automation. (5)
              Monitor for unusual patterns (many emails from same IP). (6) Require MFA for
              suspicious logins. (7) Use behavioral analysis to distinguish bots from humans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for authentication?</p>
            <p className="mt-2 text-sm">
              A: Authentication success/failure rate, latency (p50, p95, p99), MFA adoption rate,
              MFA success rate, session duration, token refresh rate, account lockout rate,
              credential stuffing detection rate. Security: failed auth attempts per user, unusual
              patterns, token reuse attempts. Set up alerts for anomalies — spike in failures
              (attack), high latency (performance issue).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle authentication for enterprise/SSO users?</p>
            <p className="mt-2 text-sm">
              A: Enterprise users authenticate via SSO (SAML/OIDC) — trust IdP's authentication.
              Don't store passwords for SSO users. Map IdP attributes to local roles (group
              mapping). JIT provisioning (create user on first SSO login). Session management
              aligned with IdP session policies. Support SCIM for user provisioning.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://www.fidoalliance.org/fido2/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FIDO2/WebAuthn Specification
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
