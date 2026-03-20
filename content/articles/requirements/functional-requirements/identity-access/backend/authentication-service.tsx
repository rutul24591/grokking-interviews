"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/authentication-service-architecture.svg"
          alt="Authentication Service Architecture"
          caption="Auth Service — showing credential validation, token issuance, session management, and scaling"
        />
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-management.svg"
          alt="Token Management"
          caption="Token Management — showing JWT structure, refresh tokens, and token rotation"
        />

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
        <h2>Common Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/auth-scalability.svg"
          alt="Authentication Service Scalability"
          caption="Scalability — showing horizontal scaling, Redis Cluster, and multi-region deployment"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design an authentication service for 100M users?</p>
            <p className="mt-2 text-sm">
              A: Stateless JWT validation, Redis Cluster for sessions (sharded by user_id), 
              database read replicas, cache user data, multi-region deployment, async audit 
              logging via Kafka. Target: p99 latency {'<'}100ms, 99.99% availability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: JWT vs opaque tokens - which do you choose?</p>
            <p className="mt-2 text-sm">
              A: Hybrid: JWT access tokens (stateless validation, short-lived) + opaque refresh 
              tokens (server-side, revocable). Best of both - fast validation with revocation 
              capability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token revocation with JWTs?</p>
            <p className="mt-2 text-sm">
              A: Short expiry (15 min) limits damage. For immediate revocation: maintain denylist 
              in Redis (token JTI + expiry), check on validation. Or use opaque tokens for 
              sessions requiring immediate revocation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent replay attacks?</p>
            <p className="mt-2 text-sm">
              A: Short token expiry, nonce/jti in tokens, track used nonces, HTTPS only, token 
              binding to device fingerprint, rotate refresh tokens on use.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement adaptive authentication?</p>
            <p className="mt-2 text-sm">
              A: Risk engine evaluates: device trust, location, time, behavior. Low risk → 
              standard auth. Medium risk → step-up MFA. High risk → block + alert. Update 
              risk model based on outcomes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle key rotation for JWT signing?</p>
            <p className="mt-2 text-sm">
              A: JWKS endpoint with multiple keys (kid). Sign with current key, validate with 
              any valid key. Rotate: generate new key pair, add to JWKS, update signers, 
              remove old key after all tokens expire.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
