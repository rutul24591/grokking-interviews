"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-token-generation",
  title: "Token Generation",
  description: "Comprehensive guide to implementing token generation covering JWT structure, signing algorithms, refresh tokens, token rotation, security patterns, and scaling for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "token-generation",
  version: "extensive",
  wordCount: 8000,
  readingTime: 32,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "tokens", "jwt", "backend", "security", "authentication"],
  relatedTopics: ["authentication-service", "session-management", "oauth-providers", "mfa-setup"],
};

export default function TokenGenerationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Token Generation</strong> is the process of creating cryptographic tokens 
          (JWT, opaque tokens) that represent authenticated user sessions. Tokens enable 
          stateless authentication, API authorization, and secure session management across 
          distributed systems.
        </p>
        <p>
          For staff and principal engineers, implementing token generation requires 
          understanding JWT structure, signing algorithms (RS256, HS256), token lifecycle 
          management, refresh token rotation, security best practices, and scaling token 
          validation across services. The implementation must balance security (short expiry, 
          rotation) with usability (seamless refresh, long sessions).
        </p>
      </section>

      <section>
        <h2>Token Types</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Access Tokens (JWT)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Purpose:</strong> Short-lived token for API authorization. Carries 
              user identity and permissions.
            </li>
            <li>
              <strong>Format:</strong> JWT (JSON Web Token) with header, payload, signature. 
              Base64url encoded.
            </li>
            <li>
              <strong>Expiry:</strong> Short-lived (15-60 minutes). Limits exposure if 
              stolen.
            </li>
            <li>
              <strong>Storage:</strong> Client memory (not localStorage). Sent via 
              Authorization header.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Refresh Tokens</h3>
          <ul className="space-y-3">
            <li>
              <strong>Purpose:</strong> Long-lived token for obtaining new access tokens. 
              Enables extended sessions.
            </li>
            <li>
              <strong>Format:</strong> Opaque (random 256-bit value). Stored server-side.
            </li>
            <li>
              <strong>Expiry:</strong> Long-lived (7-30 days). Absolute expiry regardless 
              of use.
            </li>
            <li>
              <strong>Storage:</strong> HttpOnly cookie (XSS-proof). Server-side record.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">ID Tokens (OIDC)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Purpose:</strong> Identity assertion for OIDC flows. Contains user 
              claims.
            </li>
            <li>
              <strong>Format:</strong> JWT with standard claims (sub, name, email, picture).
            </li>
            <li>
              <strong>Usage:</strong> Client consumes for user info. Not for API 
              authorization.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>JWT Structure</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Header</h3>
          <ul className="space-y-3">
            <li>
              <strong>alg:</strong> Signing algorithm (RS256, HS256, ES256).
            </li>
            <li>
              <strong>typ:</strong> Token type (JWT).
            </li>
            <li>
              <strong>kid:</strong> Key ID for key rotation (identifies signing key).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Payload (Claims)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Registered Claims:</strong> sub (user ID), iss (issuer), aud 
              (audience), exp (expiry), iat (issued at), nbf (not before), jti 
              (unique ID).
            </li>
            <li>
              <strong>Public Claims:</strong> email, name, roles, permissions. Keep 
              minimal.
            </li>
            <li>
              <strong>Private Claims:</strong> Application-specific data. Avoid 
              sensitive data.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Signature</h3>
          <ul className="space-y-3">
            <li>
              <strong>Algorithm:</strong> RS256 (RSA + SHA256) recommended for 
              distributed systems.
            </li>
            <li>
              <strong>Process:</strong> Sign(header + "." + payload, private_key). 
              Verify with public key.
            </li>
            <li>
              <strong>Key Management:</strong> Store private key in HSM or secure 
              vault. Rotate periodically.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Signing Algorithms</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">RS256 (Recommended)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Type:</strong> Asymmetric (public/private key pair).
            </li>
            <li>
              <strong>Use Case:</strong> Distributed systems, multiple services 
              validating tokens.
            </li>
            <li>
              <strong>Advantages:</strong> Public key can be distributed, private 
              key stays secure. Key rotation without service disruption.
            </li>
            <li>
              <strong>Implementation:</strong> JWKS endpoint for public key 
              distribution.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">HS256</h3>
          <ul className="space-y-3">
            <li>
              <strong>Type:</strong> Symmetric (shared secret).
            </li>
            <li>
              <strong>Use Case:</strong> Single service, simple deployments.
            </li>
            <li>
              <strong>Advantages:</strong> Simpler, faster.
            </li>
            <li>
              <strong>Disadvantages:</strong> Secret must be shared with all 
              validators. Harder to rotate.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">ES256</h3>
          <ul className="space-y-3">
            <li>
              <strong>Type:</strong> Elliptic Curve (ECDSA + SHA256).
            </li>
            <li>
              <strong>Use Case:</strong> Resource-constrained environments, 
              smaller signatures.
            </li>
            <li>
              <strong>Advantages:</strong> Smaller key size, faster than RSA.
            </li>
            <li>
              <strong>Disadvantages:</strong> Less widely supported.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Token Lifecycle</h2>
        <ul className="space-y-3">
          <li>
            <strong>Generation:</strong> Create on successful authentication. 
            Sign with private key. Set expiry.
          </li>
          <li>
            <strong>Validation:</strong> Verify signature, check expiry, validate 
            claims (iss, aud).
          </li>
          <li>
            <strong>Refresh:</strong> Exchange refresh token for new access token. 
            Rotate refresh token.
          </li>
          <li>
            <strong>Revocation:</strong> Add JTI to denylist, delete refresh 
            token, invalidate session.
          </li>
          <li>
            <strong>Expiry:</strong> Token naturally expires. Client must refresh 
            or re-authenticate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Short Expiry:</strong> Access tokens 15-60 min. Limits 
            exposure window.
          </li>
          <li>
            <strong>Token Rotation:</strong> New refresh token on each use. 
            Detect reuse attacks.
          </li>
          <li>
            <strong>Minimal Claims:</strong> Only essential data in payload. 
            Reduce token size.
          </li>
          <li>
            <strong>Key Rotation:</strong> Rotate signing keys periodically 
            (90 days). Support multiple keys during transition.
          </li>
          <li>
            <strong>Secure Storage:</strong> Private keys in HSM/vault. Never 
            in code or config files.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What claims should you include in JWT?</p>
            <p className="mt-2 text-sm">
              A: Minimum: sub (user ID), exp (expiry), iat (issued at), iss 
              (issuer), aud (audience). Optional: roles, permissions. Avoid: 
              sensitive data (password, PII), large data (keep token small).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement token rotation?</p>
            <p className="mt-2 text-sm">
              A: Generate new refresh token on each refresh request. Invalidate 
              old token. Store family chain (detect reuse). If old token used, 
              revoke entire family (all sessions).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle JWT key rotation?</p>
            <p className="mt-2 text-sm">
              A: JWKS endpoint with multiple keys (kid). Sign with current key, 
              validate with any valid key. Add new key, update signers, remove 
              old key after all tokens with old key expire.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store permissions in JWT?</p>
            <p className="mt-2 text-sm">
              A: For simple apps: yes (reduces DB lookups). For complex/dynamic 
              permissions: no (permissions change, token stale). Hybrid: store 
              roles, fetch permissions per-request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you revoke JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: Can't revoke directly (stateless). Solutions: short expiry, 
              denylist (store JTI until expiry), version claim (increment on 
              revoke, check in token), opaque tokens for revocable sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token size limits?</p>
            <p className="mt-2 text-sm">
              A: Keep claims minimal, avoid large data, use references (role 
              IDs not names), compress if needed. HTTP headers have limits 
              (~8KB). If token too large, use opaque tokens with server-side 
              lookup.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
