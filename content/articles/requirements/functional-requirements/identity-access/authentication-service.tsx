"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-authentication-service",
  title: "Authentication Service",
  description: "Comprehensive guide to building authentication services covering credential validation, token issuance, session management, security patterns, and scaling for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "authentication-service",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "authentication", "backend", "security", "tokens"],
  relatedTopics: ["token-generation", "session-management", "password-hashing", "mfa-setup"],
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
          horizontal scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/authentication-service-architecture.svg"
          alt="Authentication Service Architecture"
          caption="Authentication Service Architecture — showing service components, data flow, and integrations"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-management.svg"
          alt="Token Management"
          caption="Token Management — showing token lifecycle, storage, and rotation strategies"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/auth-scalability.svg"
          alt="Auth Scalability"
          caption="Auth Scalability — showing horizontal scaling, caching strategies, and load distribution"
        />
      
        <p>
          For staff and principal engineers, building an authentication service requires deep 
          knowledge of cryptographic protocols, token standards (JWT, OAuth), session management 
          patterns, security threats (credential stuffing, replay attacks, token theft), and 
          operational concerns (key rotation, audit logging, compliance). The service must handle 
          millions of authentication requests daily while maintaining sub-100ms latency and 
          99.99% availability.
        </p>
        <p>
          Modern authentication services have evolved from simple username/password validation to 
          supporting multiple authentication methods (password, OTP, WebAuthn, SSO), multi-factor 
          authentication, adaptive/risk-based authentication, and passwordless flows. The 
          architecture must support gradual rollout of new methods, A/B testing, and graceful 
          degradation during incidents.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Architecture</h2>
        <p>
          A production authentication service requires careful architectural decisions for security 
          and scalability.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Service Components</h3>
          <ul className="space-y-3">
            <li>
              <strong>Credential Validator:</strong> Verifies passwords against stored hashes 
              using constant-time comparison. Supports multiple hash algorithms (bcrypt, argon2) 
              for gradual migration. Implements account lockout after N failures.
            </li>
            <li>
              <strong>Token Issuer:</strong> Generates JWT access tokens and refresh tokens. 
              Signs with RS256 (asymmetric) for distributed validation. Includes minimal claims 
              (sub, exp, iat, roles). Short expiry (15-60 min) for access tokens.
            </li>
            <li>
              <strong>Session Manager:</strong> Creates and tracks user sessions in Redis. 
              Stores session metadata (device, IP, created_at). Implements sliding timeout 
              (extends on activity) and absolute timeout (max session duration).
            </li>
            <li>
              <strong>MFA Validator:</strong> Verifies TOTP codes, SMS OTP, or WebAuthn 
              assertions. Tracks MFA enrollment status. Enforces MFA policies based on risk.
            </li>
            <li>
              <strong>Risk Engine:</strong> Evaluates login risk based on device, location, 
              behavior. Triggers step-up authentication for high-risk logins. Integrates with 
              fraud detection systems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">API Design</h3>
          <ul className="space-y-3">
            <li>
              <strong>POST /auth/login:</strong> Accepts email/phone + password or OTP. Returns 
              access_token, refresh_token, user profile. Sets refresh token in HttpOnly cookie. 
              Idempotent with request ID.
            </li>
            <li>
              <strong>POST /auth/refresh:</strong> Exchanges refresh token for new access token. 
              Validates refresh token signature and expiry. Rotates refresh token (issues new, 
              invalidates old).
            </li>
            <li>
              <strong>POST /auth/logout:</strong> Invalidates refresh token and session. 
              Accepts logout_all parameter to revoke all sessions. Logs audit event.
            </li>
            <li>
              <strong>POST /auth/mfa/challenge:</strong> Initiates MFA challenge. Returns 
              challenge type (TOTP, SMS, push). Used for step-up authentication.
            </li>
            <li>
              <strong>POST /auth/mfa/verify:</strong> Verifies MFA response. Issues session 
              cookie on success. Tracks failed MFA attempts separately.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Patterns</h3>
          <ul className="space-y-3">
            <li>
              <strong>Constant-Time Comparison:</strong> Use crypto.timingSafeEqual for password 
              verification. Prevents timing attacks that leak password information.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Per-IP (100 req/min), per-account (10 req/hour), 
              per-endpoint. Use sliding window or token bucket. Return 429 with Retry-After.
            </li>
            <li>
              <strong>Account Lockout:</strong> Lock after 10 failed attempts. Exponential 
              backoff (1min, 5min, 15min, 1hr). Auto-unlock after 24 hours or support reset.
            </li>
            <li>
              <strong>Audit Logging:</strong> Log all auth events (success, failure, MFA, 
              logout). Include timestamp, user_id, IP, device, outcome. Immutable storage 
              for compliance.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Token Management</h2>

        

        <p>
          Proper token handling is critical for security and user experience.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Tokens (JWT)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Claims:</strong> sub (user_id), iat (issued_at), exp (expiry), aud 
              (audience), iss (issuer), roles/permissions. Keep minimal to reduce token size.
            </li>
            <li>
              <strong>Signing:</strong> RS256 (RSA + SHA256) for asymmetric signing. Public 
              key distributed via JWKS endpoint. Private key in HSM or secure vault.
            </li>
            <li>
              <strong>Validation:</strong> Verify signature, check expiry, validate issuer 
              and audience. Cache validation results (JWKS) to reduce latency.
            </li>
            <li>
              <strong>Storage:</strong> Client stores in memory (not localStorage). Sent via 
              Authorization: Bearer header. Short-lived (15-60 min) to limit exposure.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Refresh Tokens</h3>
          <ul className="space-y-3">
            <li>
              <strong>Format:</strong> Opaque token (random 256-bit value). Store hash in 
              database (not plaintext). Associate with user and session.
            </li>
            <li>
              <strong>Storage:</strong> HttpOnly, Secure, SameSite=Strict cookie. Prevents 
              XSS theft. Domain-scoped appropriately.
            </li>
            <li>
              <strong>Rotation:</strong> Issue new refresh token on each use. Invalidate old 
              token. Detect reuse attacks (if old token used, revoke all sessions).
            </li>
            <li>
              <strong>Expiry:</strong> Long-lived (7-30 days). Absolute expiry regardless of 
              use. Allow users to revoke via session management UI.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Scaling Considerations</h2>
        <p>
          Authentication services must scale horizontally while maintaining strong security 
          guarantees.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Horizontal Scaling</h3>
          <ul className="space-y-3">
            <li>
              <strong>Stateless Validation:</strong> JWT validation requires no database lookup. 
              Any instance can validate any token. Distribute public keys via JWKS.
            </li>
            <li>
              <strong>Session Store:</strong> Redis Cluster for session storage. Shard by 
              user_id. Replicate for HA. Accept brief session loss during failover.
            </li>
            <li>
              <strong>Database:</strong> Read replicas for user lookup. Write to primary. 
              Cache user data (password hash, MFA status) in Redis.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">High Availability</h3>
          <ul className="space-y-3">
            <li>
              <strong>Multi-Region:</strong> Deploy in 3+ regions. Global load balancing. 
              Route to nearest region. Session replication for failover.
            </li>
            <li>
              <strong>Circuit Breaker:</strong> Protect against downstream failures (user 
              database, MFA provider). Fail open or closed based on risk tolerance.
            </li>
            <li>
              <strong>Graceful Degradation:</strong> If MFA service down, allow SMS fallback. 
              If email provider down, queue verification emails. Never block authentication 
              for non-critical dependencies.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749 - OAuth 2.0 Authorization Framework
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use constant-time comparison for all credential validation</li>
          <li>Implement rate limiting at multiple levels (IP, account, endpoint)</li>
          <li>Log all authentication events for audit trails</li>
          <li>Use secure password hashing (Argon2id, bcrypt with cost 12+)</li>
          <li>Implement account lockout with progressive delays</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Management</h3>
        <ul className="space-y-2">
          <li>Use RS256 for JWT signing (asymmetric keys)</li>
          <li>Keep access tokens short-lived (15-60 minutes)</li>
          <li>Rotate refresh tokens on each use</li>
          <li>Store refresh tokens in HttpOnly, Secure cookies</li>
          <li>Implement token revocation for compromised sessions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operational Excellence</h3>
        <ul className="space-y-2">
          <li>Monitor authentication latency and error rates</li>
          <li>Set up alerts for unusual patterns (credential stuffing)</li>
          <li>Implement graceful degradation for non-critical dependencies</li>
          <li>Plan for key rotation without downtime</li>
          <li>Document incident response procedures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance</h3>
        <ul className="space-y-2">
          <li>Maintain immutable audit logs for compliance</li>
          <li>Implement data retention policies</li>
          <li>Support user data export and deletion (GDPR)</li>
          <li>Encrypt PII at rest and in transit</li>
          <li>Regular security audits and penetration testing</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Timing attacks on password validation:</strong> Non-constant-time comparison leaks password information.
            <br /><strong>Fix:</strong> Use crypto.timingSafeEqual or framework-provided constant-time comparison.
          </li>
          <li>
            <strong>Storing tokens in localStorage:</strong> XSS attacks can steal tokens.
            <br /><strong>Fix:</strong> Store access tokens in memory, refresh tokens in HttpOnly cookies.
          </li>
          <li>
            <strong>Long-lived access tokens:</strong> Extended exposure window if token is compromised.
            <br /><strong>Fix:</strong> Keep access tokens short (15-60 min). Use refresh tokens for session extension.
          </li>
          <li>
            <strong>No refresh token rotation:</strong> Stolen refresh tokens can be used indefinitely.
            <br /><strong>Fix:</strong> Issue new refresh token on each use. Invalidate old token. Detect reuse attacks.
          </li>
          <li>
            <strong>Weak password hashing:</strong> MD5, SHA1, or unsalted hashes are crackable.
            <br /><strong>Fix:</strong> Use Argon2id or bcrypt with appropriate cost factors (12+).
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force and credential stuffing attacks.
            <br /><strong>Fix:</strong> Implement per-IP, per-account, per-endpoint rate limiting with exponential backoff.
          </li>
          <li>
            <strong>Revealing user existence:</strong> Different errors for "user not found" vs "wrong password".
            <br /><strong>Fix:</strong> Use generic "Invalid credentials" message for all authentication failures.
          </li>
          <li>
            <strong>Not invalidating sessions on password change:</strong> Old sessions remain valid.
            <br /><strong>Fix:</strong> Invalidate all sessions when password changes. Force re-authentication.
          </li>
          <li>
            <strong>Hardcoded secrets in code:</strong> Secrets in version control are compromised.
            <br /><strong>Fix:</strong> Use environment variables, secret management services (Vault, AWS Secrets Manager).
          </li>
          <li>
            <strong>No audit logging:</strong> Can't investigate security incidents.
            <br /><strong>Fix:</strong> Log all auth events with timestamp, user_id, IP, device, outcome. Use immutable storage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Authentication</h3>
        <p>
          Eliminate passwords entirely using magic links, OTP, or WebAuthn.
        </p>
        <ul className="space-y-2">
          <li><strong>Magic Links:</strong> Generate one-time token, send via email, validate on click. Short expiry (15 min). Single use only.</li>
          <li><strong>WebAuthn:</strong> FIDO2 standard for biometric authentication. Platform authenticators (Touch ID, Face ID). Roaming authenticators (YubiKey). Phishing-resistant.</li>
          <li><strong>OTP:</strong> TOTP apps (Authenticator, Duo), SMS codes, email codes. Rate limit code generation. Short expiry (5 min).</li>
          <li><strong>Implementation:</strong> Keep password as fallback during transition. Monitor adoption rates. Gradually deprecate passwords.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Risk-Based Authentication</h3>
        <p>
          Adaptive authentication that adjusts security requirements based on risk signals.
        </p>
        <ul className="space-y-2">
          <li><strong>Risk Signals:</strong> Device fingerprint, location, IP reputation, time of day, behavior patterns, network type, velocity (multiple logins in short time).</li>
          <li><strong>Risk Scoring:</strong> Calculate risk score (0-100) from signals. Low risk (0-30): standard auth. Medium risk (31-70): require MFA. High risk (71-100): block and alert.</li>
          <li><strong>Step-Up Authentication:</strong> Require additional verification for sensitive actions (password change, payment, data export, new device).</li>
          <li><strong>Machine Learning:</strong> Train models on historical login data. Detect anomalies. Reduce false positives over time. Feature engineering for risk signals.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Integration</h3>
        <p>
          Support enterprise customers with SAML 2.0, OIDC, and SCIM integration.
        </p>
        <ul className="space-y-2">
          <li><strong>SAML 2.0:</strong> XML-based protocol. IdP-initiated or SP-initiated flows. Handle assertions, signatures, encryption. Support multiple IdPs (Okta, Azure AD, OneLogin).</li>
          <li><strong>OIDC:</strong> OAuth 2.0 based. ID tokens with user claims. Simpler than SAML. Growing adoption. Support PKCE for public clients.</li>
          <li><strong>SCIM:</strong> Automated user provisioning. Create/update/deactivate users based on IdP changes. Sync group memberships.</li>
          <li><strong>Just-In-Time Provisioning:</strong> Create user account on first SSO login. Map IdP attributes to local schema. Handle attribute conflicts.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Credential Stuffing Defense</h3>
        <p>
          Protect against automated attacks using breached credential databases.
        </p>
        <ul className="space-y-2">
          <li><strong>Breach Detection:</strong> Check passwords against Have I Been Pwned API during signup and password change. Warn users if password is compromised.</li>
          <li><strong>Device Fingerprinting:</strong> Collect device signals (user agent, screen resolution, fonts, timezone, WebGL, canvas). Detect automation tools (headless browsers, Selenium).</li>
          <li><strong>Behavioral Analysis:</strong> Monitor typing patterns, mouse movements, form completion time. Bots behave differently than humans. Use ML models for detection.</li>
          <li><strong>IP Intelligence:</strong> Use threat intelligence feeds (AbuseIPDB, Spamhaus). Block known bad IPs. Rate limit datacenter IPs more aggressively. Detect proxy/VPN usage.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design an authentication service for 100M users?</p>
            <p className="mt-2 text-sm">
              A: Stateless JWT validation (any instance can validate any token), Redis Cluster for sessions (sharded by user_id), database read replicas for user lookup, cache user data (password hash, MFA status) in Redis, multi-region deployment with global load balancing, async audit logging via Kafka. Target: p99 latency {'<'}100ms, 99.99% availability. Use circuit breakers for downstream dependencies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: JWT vs opaque tokens - which do you choose?</p>
            <p className="mt-2 text-sm">
              A: Hybrid approach: JWT access tokens (stateless validation, short-lived 15-60 min) + opaque refresh tokens (server-side stored, revocable, long-lived 7-30 days). Best of both worlds - fast validation without database lookup, with ability to revoke sessions immediately. Store refresh token hash in database, not plaintext.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token revocation with JWTs?</p>
            <p className="mt-2 text-sm">
              A: Short expiry (15 min) limits damage window. For immediate revocation: maintain denylist in Redis (token JTI + expiry timestamp), check on validation. Or use opaque tokens for sessions requiring immediate revocation (admin sessions, sensitive operations). Alternative: short-lived JWTs with frequent refresh requiring server validation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent replay attacks?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) Short token expiry limits replay window, (2) Include nonce/jti in tokens and track used nonces, (3) HTTPS only to prevent token interception, (4) Token binding to device fingerprint (include device hash in token, validate on use), (5) Rotate refresh tokens on each use, (6) Detect token reuse attacks and revoke all sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement adaptive authentication?</p>
            <p className="mt-2 text-sm">
              A: Risk engine evaluates multiple signals: device trust (known device?), location (usual location?), time (normal hours?), behavior (typical patterns?), velocity (multiple logins?). Calculate risk score (0-100). Low risk (0-30): standard auth flow. Medium risk (31-70): step-up MFA required. High risk (71-100): block authentication and alert security team. Update risk model based on outcomes (false positives/negatives).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle key rotation for JWT signing?</p>
            <p className="mt-2 text-sm">
              A: JWKS endpoint with multiple keys identified by kid (key ID). Sign with current key, validate with any valid key. Rotation process: (1) Generate new key pair, (2) Add to JWKS with new kid, (3) Update signers to use new key, (4) Keep old key in JWKS until all tokens signed with it expire, (5) Remove old key. Zero downtime, no invalidation of existing tokens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure refresh tokens?</p>
            <p className="mt-2 text-sm">
              A: Store as opaque 256-bit random values. Hash before storing in database (like passwords). Set in HttpOnly, Secure, SameSite=Strict cookie to prevent XSS theft. Rotate on each use (issue new, invalidate old). Detect reuse attacks (if old token used, attacker has it - revoke all sessions). Long expiry (7-30 days) but absolute timeout regardless of use. Allow users to revoke via session management UI.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle authentication during database outages?</p>
            <p className="mt-2 text-sm">
              A: Graceful degradation strategy: (1) Cache user data (password hash, MFA status) in Redis with TTL. (2) If database down, authenticate against cache (stale but functional). (3) Accept slightly higher risk for availability. (4) Queue audit logs for later replay. (5) Circuit breaker to prevent cascade failures. (6) For critical operations (password change), fail closed and show maintenance message.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you monitor for authentication service?</p>
            <p className="mt-2 text-sm">
              A: Primary: Authentication success/failure rate, p50/p95/p99 latency, error rate by error type. Security: Failed login attempts per IP/account, account lockouts, MFA bypass attempts, credential stuffing detection rate. Operational: Token refresh rate, session count, cache hit rate, database query latency. Business: Signup conversion, login frequency, active sessions. Set up alerts for anomalies (spike in failures, latency degradation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-factor authentication in the auth flow?</p>
            <p className="mt-2 text-sm">
              A: After credential validation, check user MFA enrollment status. If enrolled and required (policy or risk-based), return challenge_required response with available methods (TOTP, SMS, push). Client prompts user for MFA. On MFA verify endpoint, validate code/assertion. If valid, issue tokens and create session. Track MFA success/failure separately. Allow backup codes for account recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement single sign-on (SSO) across services?</p>
            <p className="mt-2 text-sm">
              A: Central auth service issues JWT tokens. All services validate JWT using shared public key (JWKS). Include user_id, roles, permissions in token claims. Services extract user info from token (no database lookup). For logout, maintain session denylist in Redis (propagates to all services). Use short-lived tokens (15 min) with refresh for security.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ Constant-time comparison for password validation</li>
            <li>☐ Rate limiting implemented (IP, account, endpoint)</li>
            <li>☐ Account lockout with progressive delays</li>
            <li>☐ Secure password hashing (Argon2id, bcrypt 12+)</li>
            <li>☐ JWT signing with RS256 (asymmetric keys)</li>
            <li>☐ Refresh token rotation on each use</li>
            <li>☐ HttpOnly, Secure, SameSite cookies for tokens</li>
            <li>☐ Audit logging for all authentication events</li>
            <li>☐ Generic error messages (no user enumeration)</li>
            <li>☐ HTTPS enforced with HSTS</li>
            <li>☐ Secrets in secure vault (not code)</li>
            <li>☐ Key rotation procedure documented and tested</li>
            <li>☐ Incident response plan documented</li>
            <li>☐ Penetration testing completed</li>
            <li>☐ Compliance requirements met (GDPR, SOC2)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test credential validation (valid/invalid passwords)</li>
          <li>Test token generation and validation</li>
          <li>Test rate limiting logic</li>
          <li>Test account lockout behavior</li>
          <li>Test MFA validation (TOTP, SMS)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test complete login flow end-to-end</li>
          <li>Test token refresh flow</li>
          <li>Test logout (single session, all sessions)</li>
          <li>Test MFA enrollment and verification</li>
          <li>Test password reset flow</li>
          <li>Test social login integration</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test timing attack resistance</li>
          <li>Test rate limiting effectiveness</li>
          <li>Test account lockout bypass attempts</li>
          <li>Test token tampering detection</li>
          <li>Test refresh token reuse detection</li>
          <li>Penetration testing for auth bypass</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Tests</h3>
        <ul className="space-y-2">
          <li>Test authentication throughput (requests/second)</li>
          <li>Test latency under load (p50, p95, p99)</li>
          <li>Test Redis Cluster failover</li>
          <li>Test database failover</li>
          <li>Test multi-region failover</li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Credential Validation</h3>
        <p>
          Implement secure password validation with constant-time comparison. Use bcrypt or Argon2id for hashing with appropriate cost factors (bcrypt cost 12+, Argon2id memory 64MB). Check passwords against breach databases (Have I Been Pwned API) during signup and password change. Implement progressive hashing - when user logs in with old hash, re-hash with new parameters.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <p>
          Store sessions in Redis Cluster with user_id as key. Include session metadata: device fingerprint, IP address, created_at, last_activity, user_agent. Implement sliding timeout (extend on activity) and absolute timeout (max session duration). Support concurrent session limits per user. Provide session revocation API for security incidents.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Refresh Flow</h3>
        <p>
          Accept refresh token from HttpOnly cookie. Validate signature and expiry. Check token against denylist (revoked tokens). Generate new access token with updated claims. Issue new refresh token and invalidate old (rotation). Update session last_activity timestamp. Return new access token in response body (not cookie).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Logging</h3>
        <p>
          Log all authentication events asynchronously via message queue (Kafka, SQS). Include: timestamp, user_id, event_type (login_success, login_failure, mfa_challenge, logout), IP address, device fingerprint, user agent, outcome. Use immutable storage (write-once) for compliance. Implement log retention policies (90 days hot, 7 years cold).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <p>
          Use generic error messages for authentication failures (no user enumeration). Return structured error responses with error codes for client handling. Implement circuit breakers for downstream dependencies. Graceful degradation when non-critical services unavailable. Log detailed errors internally, show user-friendly messages externally.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Global Social Media Authentication</h3>
        <p>
          Social media platform with 2B users, 100M daily authentications across multiple regions.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Handle 1M auth requests/minute during peak. Multi-region failover. Support multiple auth methods (password, social, passkey).</li>
          <li><strong>Solution:</strong> Stateless JWT validation at edge (CDN). Redis Cluster for sessions (sharded by user_id). Active-active deployment across 5 regions.</li>
          <li><strong>Result:</strong> p99 latency under 50ms. 99.999% availability. Zero downtime during region failover.</li>
          <li><strong>Security:</strong> Rate limiting (100 req/min per IP), credential stuffing detection, adaptive MFA based on risk.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services Authentication</h3>
        <p>
          Online banking and investment platform with strict regulatory requirements.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> PCI-DSS, SOX, GDPR compliance. Strong customer authentication (SCA) required. Audit trail for all auth events.</li>
          <li><strong>Solution:</strong> Mandatory MFA for all users. Step-up authentication for high-value transactions. Immutable audit logging to WORM storage.</li>
          <li><strong>Result:</strong> Passed all compliance audits. Fraud reduced by 90%. Customer satisfaction improved (clear auth flows).</li>
          <li><strong>Security:</strong> Hardware security modules (HSM) for key storage, transaction signing, biometric authentication support.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform Authentication</h3>
        <p>
          HIPAA-compliant telemedicine platform serving 10M patients.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA compliance requires strict access controls. Elderly patients need simple auth flow. Support for providers (doctors) and patients.</li>
          <li><strong>Solution:</strong> Role-based auth flows (simplified for patients, enhanced for providers). Passwordless option for patients. Mandatory MFA for providers.</li>
          <li><strong>Result:</strong> HIPAA audit passed. 95% patient adoption. Provider satisfaction high (quick MFA with hardware keys).</li>
          <li><strong>Security:</strong> Session timeout (15 min idle), automatic logout, audit logging, break-glass access for emergencies.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Authentication</h3>
        <p>
          Online gaming platform with 50M registered users, high concurrent logins during game launches.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> 10M concurrent logins during new game releases. Prevent account sharing and bot accounts. Global player base.</li>
          <li><strong>Solution:</strong> Edge authentication (JWT validation at CDN). Queue-based auth during peak. Device fingerprinting for account sharing detection.</li>
          <li><strong>Result:</strong> Handled 15M concurrent logins. p99 latency under 100ms. Account sharing reduced by 70%.</li>
          <li><strong>Security:</strong> Behavioral analysis for bot detection, rate limiting per account, geographic anomaly detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Authentication</h3>
        <p>
          B2B SaaS platform with 50,000 enterprise customers requiring SSO integration.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Support multiple IdPs (Okta, Azure AD, OneLogin, Ping). JIT provisioning for automatic user creation. Handle SAML + OIDC.</li>
          <li><strong>Solution:</strong> Abstract IdP integration behind common interface. Support both SAML 2.0 and OIDC. SCIM for user provisioning.</li>
          <li><strong>Result:</strong> Onboarded 500 enterprise customers in 6 months. 99.9% SSO success rate. Reduced support tickets by 60%.</li>
          <li><strong>Security:</strong> IdP-initiated logout, session sync with IdP policies, audit logging for compliance reporting.</li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://www.rfc-editor.org/rfc/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">RFC 6749 - OAuth 2.0 Authorization Framework</a></li>
          <li><a href="https://www.rfc-editor.org/rfc/rfc7519" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">RFC 7519 - JSON Web Token (JWT)</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Have I Been Pwned API</a></li>
          <li><a href="https://github.com/panva/jose" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">jose - JWT Library</a></li>
          <li><a href="https://redis.io/docs/manual/scaling/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Redis Cluster Documentation</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
