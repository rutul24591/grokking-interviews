"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-jwt-extensive",
  title: "JWT (JSON Web Tokens)",
  description:
    "Staff-level deep dive into JWT structure, claims, signature verification, token lifecycle, storage patterns, and the operational practice of securing JWTs at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "jwt-json-web-tokens",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "jwt", "authentication", "tokens"],
  relatedTopics: ["oauth-2-0", "session-management", "authentication-vs-authorization", "single-sign-on-sso"],
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
          <strong>JSON Web Tokens (JWT)</strong> are a compact, URL-safe token format defined by RFC 7519 that
          carries claims (statements about an entity, typically the user) between parties. A JWT consists of three
          base64url-encoded sections separated by dots: the header (metadata about the token, including the signing
          algorithm), the payload (the claims), and the signature (a cryptographic signature that ensures the token
          has not been tampered with). JWTs are the de facto standard for token-based authentication in modern
          distributed systems — they are used in OAuth 2.0 access tokens, OpenID Connect ID tokens, API
          authentication, and session management.
        </p>
        <p>
          The key property of JWTs is that they are self-contained — all the information needed to validate and
          process the token is contained within the token itself. This enables stateless authentication: the resource
          server can validate the JWT&apos;s signature and extract the claims without calling the authorization server or
          looking up a session in a database. This is a significant architectural advantage in distributed systems,
          where a database lookup on every request would create a bottleneck and a single point of failure.
        </p>
        <p>
          However, JWTs have significant security implications. They are not encrypted — the header and payload are
          base64url-encoded, which is trivially reversible. Anyone who obtains a JWT can read its claims. JWTs cannot
          be revoked until they expire — if a JWT is compromised, it remains valid until expiration. And JWT
          validation is complex — there are numerous implementation pitfalls (algorithm confusion, accepting unsigned
          tokens, ignoring expiration) that have led to real-world vulnerabilities.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">JWT is Not Encryption</h3>
          <p className="text-muted mb-3">
            A common misconception is that JWTs are encrypted. They are not — the header and payload are base64url-encoded, which is easily decoded. Anyone who obtains a JWT can read the claims (user identity, roles, scopes, expiration). If you need to protect the claims from being read, use JWE (JSON Web Encryption), which encrypts the payload. However, JWE is rarely used in practice — most systems rely on transport security (HTTPS) to protect JWTs in transit and secure storage to protect them at rest.
          </p>
          <p>
            The signature ensures integrity (the token has not been tampered with), not confidentiality (the claims are still readable). Never store sensitive data (passwords, social security numbers, credit card numbers) in JWT claims.
          </p>
        </div>
        <p>
          The evolution of JWT usage has been shaped by security vulnerabilities. Early implementations accepted
          unsigned tokens (alg: none), allowing attackers to forge tokens. Others were vulnerable to algorithm
          confusion attacks, where an attacker changed the algorithm from RS256 (asymmetric) to HS256 (symmetric)
          and signed the token with the public key. Modern JWT libraries mitigate these vulnerabilities by default —
          they reject unsigned tokens, whitelist allowed algorithms, and validate all claims. However, developers
          must use these libraries correctly and follow security best practices.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The JWT header contains metadata about the token — the signing algorithm (alg), the token type (typ,
          typically &quot;JWT&quot;), and optionally the key ID (kid) used to select the correct key for signature validation.
          The algorithm is critical — it determines how the signature is computed and validated. Common algorithms
          include HS256 (HMAC with SHA-256, symmetric), RS256 (RSA with SHA-256, asymmetric), and ES256 (ECDSA with
          SHA-256, asymmetric). The choice of algorithm depends on the architecture — symmetric algorithms are simpler
          but require the same secret on both the issuer and validator, while asymmetric algorithms enable public key
          validation (the issuer signs with a private key, and anyone with the public key can validate the signature).
        </p>
        <p>
          The JWT payload contains claims — statements about an entity (typically the user). Claims are categorized
          as registered (standard claims defined by the RFC, such as sub for subject, iss for issuer, aud for
          audience, exp for expiration, iat for issued-at), public (claims registered in the IANA registry or with
          collision-resistant names), and private (custom claims agreed upon by the parties). The claims are the
          core of the JWT — they carry the information that the resource server needs to process the request (user
          identity, roles, scopes, permissions).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/jwt-json-web-tokens-diagram-1.svg"
          alt="JWT structure showing header, payload, and signature sections with their claims and encoding"
          caption="JWT structure: three base64url-encoded sections (header, payload, signature) separated by dots. The signature ensures integrity — the token has not been tampered with."
        />
        <p>
          The JWT signature is computed by signing the base64url-encoded header and payload with the signing key
          using the specified algorithm. The signature ensures that the token has not been tampered with — if an
          attacker modifies the header or payload, the signature will not match, and the token will be rejected. The
          signature is validated by the resource server using the signing key (for symmetric algorithms) or the
          public key (for asymmetric algorithms).
        </p>
        <p>
          JWT validation is a multi-step process. The resource server must: verify the signature (using the correct
          key and algorithm), check the expiration (rejecting expired tokens), validate the issuer (ensuring the
          token was issued by the expected authorization server), validate the audience (ensuring the token was
          intended for this resource server), and evaluate any additional claims (such as scopes or roles). If any
          validation step fails, the token is rejected with a 401 Unauthorized response.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/jwt-json-web-tokens-diagram-2.svg"
          alt="JWT vs Session Tokens comparison showing stateless vs stateful authentication approaches"
          caption="JWT vs Session: JWTs are self-contained and enable stateless validation (no database call), but cannot be revoked until expiration. Session tokens require a session store but enable immediate revocation."
        />
        <p>
          JWT storage is a critical operational concern. For web applications, JWTs should be stored in httpOnly,
          Secure, SameSite cookies — this prevents XSS from stealing the token (httpOnly), ensures the cookie is
          only sent over HTTPS (Secure), and prevents CSRF attacks (SameSite). For mobile applications, JWTs should
          be stored in the platform&apos;s secure storage (Keychain on iOS, Keystore on Android). JWTs should never be
          stored in localStorage or sessionStorage — these are accessible to JavaScript and vulnerable to XSS
          attacks.
        </p>
        <p>
          JWT lifecycle includes issuance (the authorization server creates and signs the token), usage (the client
          presents the token with each request), validation (the resource server verifies the token), refresh
          (the client obtains a new token before the old one expires), and revocation (the token is invalidated
          before expiration). The lifecycle is managed by the client (which stores and presents the token), the
          authorization server (which issues and revokes tokens), and the resource server (which validates tokens).
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The JWT architecture consists of the issuer (which creates and signs tokens), the client (which stores
          and presents tokens), and the validator (which verifies tokens). The issuer generates the JWT by
          constructing the header and payload, computing the signature, and concatenating the three sections. The
          client stores the JWT securely and presents it with each API request (typically in the Authorization:
          Bearer header). The validator verifies the JWT by checking the signature, expiration, issuer, audience,
          and claims.
        </p>
        <p>
          In a distributed system, the issuer and validator may be different services. The issuer signs tokens with
          a private key (for asymmetric algorithms) or a shared secret (for symmetric algorithms). The validator
          validates tokens using the corresponding public key or shared secret. For asymmetric algorithms, the
          issuer publishes its public keys on a well-known endpoint (the JWKS endpoint), and the validator fetches
          the public key dynamically. This enables key rotation — the issuer can rotate its keys without requiring
          the validator to be reconfigured.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/jwt-json-web-tokens-diagram-3.svg"
          alt="JWT security considerations showing attack vectors, defense measures, and algorithm comparison"
          caption="JWT security: common attacks include token theft, algorithm confusion, and replay attacks. Defenses include secure storage, algorithm whitelisting, short expiration with refresh rotation, and avoiding sensitive data in claims."
        />
        <p>
          Key rotation is essential for security — if a signing key is compromised, all tokens signed with that key
          are vulnerable. The issuer should rotate its signing keys regularly (every 90 days or sooner), and the
          validator should fetch the updated public keys from the JWKS endpoint. During rotation, the issuer signs
          tokens with both the old and new keys for a transition period, and the validator accepts tokens signed
          with either key. After the transition period, the old key is retired.
        </p>
        <p>
          JWT revocation is challenging because JWTs are self-contained and cannot be revoked until they expire.
          For systems that require immediate revocation (user logout, password change, token compromise), the
          resource server must maintain a denylist (a database of revoked token IDs) and check it on each request.
          Alternatively, use short-lived access tokens (5-15 minutes) with refresh token rotation — if a token is
          compromised, the attacker&apos;s access is limited to the token&apos;s short lifetime, and refresh token rotation
          detects theft and revokes the token family.
        </p>
        <p>
          Claim design is an architectural decision that affects the entire system. Claims should be minimal — only
          include the information that the resource server needs to process the request. Avoid including sensitive
          data (passwords, social security numbers) or large data (user profiles, preferences) in claims — this
          increases the token size and exposes the data to anyone who obtains the token. Use a reference claim
          (such as a user ID) instead of embedding the full user profile — the resource server can look up the user
          profile from a database if needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          JWT versus opaque tokens is the primary trade-off in token design. JWTs are self-contained — they carry
          claims that the resource server can validate without calling the authorization server. This enables
          stateless authentication, which is simpler to scale and operate. However, JWTs cannot be revoked until
          they expire — if a JWT is compromised, it remains valid until expiration. Opaque tokens are references
          to server-side session state — the resource server must call the authorization server to validate the
          token and retrieve the claims. This enables immediate revocation, but introduces a network dependency
          and latency on each request.
        </p>
        <p>
          Symmetric versus asymmetric signing is a trade-off between simplicity and security. Symmetric algorithms
          (HS256) use the same secret for signing and validation — simpler to implement but requires the secret to
          be shared between the issuer and all validators. If the secret is compromised, all tokens are vulnerable.
          Asymmetric algorithms (RS256, ES256) use a private key for signing and a public key for validation — the
          public key can be published, and anyone with the public key can validate tokens without being able to
          forge them. Asymmetric algorithms are recommended for distributed systems where multiple services validate
          tokens.
        </p>
        <p>
          Storing claims in the JWT versus in a database is a trade-off between performance and flexibility. Storing
          claims in the JWT enables stateless validation — the resource server does not need to call a database to
          retrieve the user&apos;s roles and permissions. However, if the user&apos;s roles or permissions change, the JWT
          must be reissued — the resource server cannot update the claims in the existing JWT. Storing claims in a
          database enables real-time updates — if the user&apos;s roles change, the database is updated immediately, and
          the resource server retrieves the updated claims on the next request. The recommended approach for most
          systems is to store minimal claims in the JWT (user ID, expiration, issuer) and look up additional claims
          (roles, permissions) from a database or cache.
        </p>
        <p>
          Short-lived versus long-lived JWTs is a trade-off between security and user experience. Short-lived JWTs
          (5-15 minutes) limit the window of opportunity if a token is compromised — the attacker&apos;s access is limited
          to the token&apos;s short lifetime. However, the user must refresh the token frequently, which adds complexity
          (the client must handle token refresh gracefully, including race conditions and network failures). Long-lived
          JWTs (24 hours or more) reduce the need for refresh but increase the risk — if a token is compromised, the
          attacker has access for the token&apos;s entire lifetime. The recommended approach is short-lived access tokens
          (5-15 minutes) with long-lived refresh tokens (7-30 days) — the access token limits the attacker&apos;s window,
          and the refresh token rotation detects theft and revokes the token family.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use asymmetric signing algorithms (RS256 or ES256) for distributed systems. Asymmetric algorithms enable
          the issuer to sign tokens with a private key and the validator to validate tokens with the corresponding
          public key. This eliminates the need to share a secret between the issuer and all validators, and it
          enables key rotation without reconfiguring the validators.
        </p>
        <p>
          Use short-lived access tokens (5-15 minutes) with refresh token rotation. Short-lived access tokens limit
          the window of opportunity if a token is compromised. Refresh token rotation detects token theft — if a
          refresh token is reused, the authorization server revokes the entire token family. The client must handle
          token rotation gracefully, updating its stored tokens on each refresh.
        </p>
        <p>
          Validate all JWT claims — signature, expiration, issuer, audience, and any additional claims (scopes,
          roles). Use a well-tested JWT library (jose, PyJWT, jsonwebtoken) — do not implement JWT validation
          yourself. Configure the library to reject unsigned tokens (alg: none), whitelist allowed algorithms, and
          validate all claims. Never trust the algorithm header — always verify that the algorithm matches the
          expected algorithm for the key.
        </p>
        <p>
          Store JWTs securely — httpOnly, Secure, SameSite cookies for web applications; Keychain/Keystore for
          mobile applications. Never store JWTs in localStorage or sessionStorage. For SPAs, use the
          Backend-for-Frontend (BFF) pattern — the SPA communicates with a backend that manages JWTs, so the SPA
          never handles JWTs directly.
        </p>
        <p>
          Keep JWT claims minimal — only include the information that the resource server needs to process the
          request. Avoid including sensitive data (passwords, PII) or large data (user profiles, preferences) in
          claims. Use a reference claim (user ID) instead of embedding the full user profile — the resource server
          can look up the user profile from a database if needed.
        </p>
        <p>
          Implement key rotation — rotate signing keys regularly (every 90 days or sooner), publish public keys on
          a JWKS endpoint, and support key overlap during the transition period. During rotation, sign tokens with
          both the old and new keys, and accept tokens signed with either key. After the transition period, retire
          the old key.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Accepting unsigned tokens (alg: none) is a critical vulnerability. Some JWT libraries accept unsigned
          tokens by default — if the algorithm header is set to &quot;none&quot;, the library skips signature validation. An
          attacker can forge a token by setting the algorithm to &quot;none&quot; and removing the signature. The fix is to
          configure the JWT library to reject unsigned tokens and to whitelist allowed algorithms.
        </p>
        <p>
          Algorithm confusion attacks occur when the attacker changes the algorithm from RS256 (asymmetric) to
          HS256 (symmetric) and signs the token with the public key. Since the public key is known, the attacker
          can forge tokens that the validator accepts as valid. The fix is to whitelist allowed algorithms — if the
          system uses RS256, the validator should only accept RS256 tokens and reject all other algorithms.
        </p>
        <p>
          Storing sensitive data in JWT claims is a common pitfall. JWT claims are base64url-encoded, not encrypted
          — anyone who obtains a JWT can read the claims. Storing sensitive data (passwords, social security numbers,
          credit card numbers) in claims exposes the data to anyone who obtains the token. The fix is to never store
          sensitive data in JWT claims — use reference claims (user ID) instead, and look up sensitive data from a
          secure database if needed.
        </p>
        <p>
          Not validating the expiration claim is a common implementation pitfall. If the resource server does not
          check the expiration (exp claim), expired tokens remain valid indefinitely. The fix is to configure the
          JWT library to validate the expiration automatically — all well-tested JWT libraries do this by default,
          but it is easy to disable inadvertently.
        </p>
        <p>
          Storing JWTs in localStorage is a common security pitfall. localStorage is accessible to any JavaScript
          running on the page — including malicious scripts injected via XSS. The fix is to store JWTs in httpOnly
          cookies (for web applications) or in the platform&apos;s secure storage (for mobile applications). For SPAs,
          use the BFF pattern.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses JWTs for API authentication — users authenticate through the platform&apos;s
          identity provider, which issues JWTs with short expiration (15 minutes) and refresh tokens with rotation.
          The JWTs contain the user&apos;s ID, roles, and tenant ID. The API gateway validates the JWT&apos;s signature and
          expiration, and the service layer evaluates the user&apos;s roles to determine what actions they can perform.
          The platform uses RS256 for signing, with the identity provider signing tokens using a private key and the
          API gateway validating tokens using the corresponding public key (fetched from the JWKS endpoint).
        </p>
        <p>
          A financial services company uses JWTs for service-to-service authentication. Each service is assigned a
          client ID and private key, and it obtains JWTs from the authorization server using the Client Credentials
          flow. The JWTs contain the service&apos;s identity (sub claim) and the scopes it is authorized to use. The
          target service validates the JWT&apos;s signature, expiration, and scopes, and processes the request if the
          JWT is valid. The company uses ES256 for signing (smaller signatures, faster validation) and rotates
          signing keys every 90 days.
        </p>
        <p>
          A healthcare organization uses JWTs for federated identity — healthcare providers authenticate through
          their organization&apos;s identity provider (Okta, Active Directory) using OpenID Connect. The identity provider
          issues ID tokens (JWTs) that contain the provider&apos;s identity, roles, and assigned patients. The authorization
          system evaluates the ID token&apos;s claims to determine what patient records the provider can access. The JWTs
          are short-lived (5 minutes) and are refreshed automatically using the refresh token. The organization uses
          RS256 for signing and publishes public keys on a JWKS endpoint for validation.
        </p>
        <p>
          A SaaS platform uses JWTs for multi-tenant authentication — users authenticate through the platform&apos;s
          identity provider, which issues JWTs containing the user&apos;s identity, tenant ID, and roles. The JWTs are
          validated by the API gateway, which extracts the tenant ID and routes the request to the appropriate
          tenant&apos;s data. The platform uses RS256 for signing and rotates keys every 90 days. The JWTs are stored in
          httpOnly, Secure, SameSite cookies, and the platform uses the BFF pattern to manage JWTs on behalf of the
          SPA.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between JWT and JWE, and when would you use each?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JWT (JSON Web Token) is a signed token — the signature ensures integrity (the token has not been tampered with), but the claims are readable (base64url-encoded, not encrypted). JWE (JSON Web Encryption) is an encrypted token — the payload is encrypted, so only parties with the decryption key can read the claims.
            </p>
            <p>
              Use JWT when the claims are not sensitive and you need the resource server to read them without decryption. Use JWE when the claims are sensitive and must be protected from being read by anyone who obtains the token. In practice, JWT is far more common — most systems rely on transport security (HTTPS) and secure storage to protect JWTs, and JWE is rarely used.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you handle JWT revocation in a distributed system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JWTs are self-contained and cannot be revoked until they expire. To handle revocation, use short-lived access tokens (5-15 minutes) with refresh token rotation. If a token is compromised, the attacker&apos;s access is limited to the token&apos;s short lifetime, and refresh token rotation detects theft and revokes the token family.
            </p>
            <p>
              For immediate revocation (logout, account compromise), maintain a denylist (a distributed database of revoked token IDs). Each resource server checks the denylist when validating a JWT. The denylist should be distributed to all resource servers with low latency (using a cache or a distributed data store). Alternatively, use opaque tokens instead of JWTs — opaque tokens are references to server-side session state, so revocation is immediate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the algorithm confusion attack, and how do you prevent it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The algorithm confusion attack occurs when the attacker changes the JWT&apos;s algorithm header from RS256 (asymmetric) to HS256 (symmetric) and signs the token with the public key. Since the public key is known, the attacker can forge tokens that the validator accepts as valid — the validator uses the public key as the HMAC secret, which produces the same signature.
            </p>
            <p>
              The fix is to whitelist allowed algorithms — if the system uses RS256, the validator should only accept RS256 tokens and reject all other algorithms. All well-tested JWT libraries support algorithm whitelisting. Additionally, use separate keys for signing and validation — the public key should not be usable as an HMAC secret.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you design claims for a multi-tenant JWT?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Claims should be minimal — only include the information that the resource server needs to process the request. For multi-tenant systems, include the user&apos;s ID (sub), the tenant ID (tenant_id), the user&apos;s roles within the tenant (roles), and the scopes (scopes). Do not include the full user profile, tenant configuration, or permissions — these can be looked up from a database or cache if needed.
            </p>
            <p>
              Claims should be validated by the resource server — the resource server must verify that the tenant_id in the JWT matches the tenant that the user is trying to access. Never trust the client to specify the tenant — always extract it from the JWT. Claims should be versioned — when a claim&apos;s meaning changes, increment the version to avoid breaking existing resource servers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are the security implications of storing JWTs in localStorage?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              localStorage is accessible to any JavaScript running on the page — including malicious scripts injected via XSS. If a JWT is stored in localStorage, an XSS attack can steal the JWT and use it to authenticate as the user. The attacker can then access all resources that the user is authorized to access, for as long as the JWT is valid.
            </p>
            <p>
              The fix is to store JWTs in httpOnly cookies (for web applications) — httpOnly cookies are not accessible to JavaScript, so XSS cannot steal them. For mobile applications, store JWTs in the platform&apos;s secure storage (Keychain on iOS, Keystore on Android). For SPAs, use the BFF pattern — the SPA communicates with a backend that manages JWTs, so the SPA never handles JWTs directly.
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
            <a href="https://datatracker.ietf.org/doc/html/rfc7519" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7519: JSON Web Token (JWT)
            </a> — The core JWT specification defining structure and claims.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc7515" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7515: JSON Web Signature (JWS)
            </a> — The signature specification that JWT uses.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc8725" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 8725: JSON Web Token Best Current Practices
            </a> — Security recommendations and common pitfalls.
          </li>
          <li>
            <a href="https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0: Tokens vs Cookies
            </a> — Comparison of token storage approaches and security implications.
          </li>
          <li>
            <a href="https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Hasura: JWT Best Practices
            </a> — Practical guide to JWT implementation and validation.
          </li>
          <li>
            <a href="https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Okta: Why JWTs Suck as Session Tokens
            </a> — Critique of JWTs for session management and alternatives.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}