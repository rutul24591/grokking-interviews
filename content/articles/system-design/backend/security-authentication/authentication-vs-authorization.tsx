"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-authentication-vs-authorization-extensive",
  title: "Authentication vs Authorization",
  description:
    "Staff-level deep dive into authentication and authorization architecture, trust boundaries, enforcement patterns, and the operational practice of securing identity and access at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "authentication-vs-authorization",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "authentication", "authorization", "identity"],
  relatedTopics: ["oauth-2-0", "jwt-json-web-tokens", "rbac-role-based-access-control", "session-management"],
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
          <strong>Authentication</strong> (AuthN) is the process of verifying the identity of a user, service, or
          system attempting to access a resource. It answers the question &quot;Who are you?&quot; through credential
          validation — passwords, tokens, certificates, biometric data, or security keys. Authentication establishes
          a principal identity that can be referenced in subsequent access decisions.
        </p>
        <p>
          <strong>Authorization</strong> (AuthZ) is the process of determining what an authenticated principal is
          permitted to do. It answers the question &quot;What can you do?&quot; through policy evaluation — role-based
          access control (RBAC), attribute-based access control (ABAC), access control lists (ACLs), or relationship-based
          access control (ReBAC). Authorization enforces permissions on each request, ensuring that even an authenticated
          principal cannot access resources or perform actions outside their granted permissions.
        </p>
        <p>
          The distinction between authentication and authorization is fundamental but frequently misunderstood.
          Authentication is a prerequisite for authorization — you cannot determine what someone is allowed to do
          until you know who they are. However, authentication alone is insufficient for security — an authenticated
          user with unrestricted access is functionally equivalent to no access control at all. Production systems must
          implement both, with clear boundaries between identity verification (AuthN) and permission enforcement (AuthZ).
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">The Authentication-Authorization Chain</h3>
          <p className="text-muted mb-3">
            Every protected request follows a consistent flow: the client presents credentials (authentication), the
            identity provider verifies those credentials and issues a token (token issuance), the client presents the
            token with each request (bearer authentication), and the resource server validates the token and evaluates
            permissions (authorization) before processing the request.
          </p>
          <p>
            This chain must be implemented consistently across all services, APIs, and entry points. Inconsistent
            implementation — where some endpoints enforce authorization while others trust the gateway&apos;s
            authentication — is the most common root cause of authorization bypass vulnerabilities and data leakage
            incidents.
          </p>
        </div>
        <p>
          The evolution of authentication and authorization has progressed from simple username/password systems to
          complex federated identity ecosystems. Modern systems use OpenID Connect (OIDC) for authentication (built on
          top of OAuth 2.0), JSON Web Tokens (JWT) for token-based identity propagation, and policy engines (OPA,
          AWS IAM, Cedar) for fine-grained authorization. The complexity of these systems introduces operational
          challenges — token validation, policy management, permission auditing, and incident response — that require
          dedicated engineering attention and mature operational practices.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The trust boundary between authentication and authorization is the most important security boundary in any
          system. Authentication occurs at the boundary — the identity provider verifies credentials and issues a
          token. Authorization occurs within the boundary — each service evaluates the token and enforces permissions
          on the requested action. If the trust boundary is violated — for example, if an internal service trusts the
          gateway&apos;s authentication without performing its own authorization check — the system is vulnerable to
          lateral movement attacks, where an authenticated but unauthorized principal can access resources they should
          not.
        </p>
        <p>
          Authentication methods span a spectrum of security strength. Passwords are the weakest — vulnerable to brute
          force, phishing, credential stuffing, and reuse attacks. Multi-factor authentication (MFA) adds a second
          factor (something you have, such as a TOTP code or security key), significantly reducing the risk of
          credential-based attacks. Federated identity (OAuth 2.0, SAML, OIDC) delegates authentication to a trusted
          identity provider, reducing the attack surface by eliminating local password storage. Security keys and
          passkeys (WebAuthn) are the strongest — phishing-resistant, hardware-backed, and immune to credential
          theft attacks.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/authentication-vs-authorization-diagram-1.svg"
          alt="Authentication and authorization flow showing identity verification followed by permission enforcement"
          caption="Authentication establishes identity through credential validation and token issuance. Authorization enforces permissions on each request through policy evaluation — RBAC, ABAC, or ACL models."
        />
        <p>
          Authorization models also span a spectrum of granularity. Role-based access control (RBAC) assigns
          permissions to roles, and roles to users — simple to manage but coarse-grained. Attribute-based access
          control (ABAC) evaluates policies based on attributes of the user, resource, action, and environment —
          fine-grained but complex to manage. Access control lists (ACLs) attach permissions directly to resources —
          simple for small systems but unmanageable at scale. Relationship-based access control (ReBAC) grants
          access based on relationships between entities (e.g., &quot;users can access documents they own&quot;) — natural
          for social and collaborative systems.
        </p>
        <p>
          Token-based authentication has become the standard for distributed systems. JWTs are the most common token
          format — self-contained, cryptographically signed tokens that carry claims (user identity, roles, scopes,
          expiration). The advantage of JWTs is that they enable stateless authentication — the resource server can
          validate the token&apos;s signature without calling the identity provider. The disadvantage is that JWTs cannot
          be revoked until they expire — if a token is compromised, it remains valid until expiration. Session-based
          authentication, by contrast, is stateful — the server maintains a session store and can revoke sessions
          immediately, but requires a database lookup on each request.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/authentication-vs-authorization-diagram-2.svg"
          alt="Authentication methods comparison from passwords (weakest) to security keys and passkeys (strongest)"
          caption="Authentication methods span a spectrum of security strength. Passwords are the weakest; passkeys and security keys (WebAuthn) are the strongest and phishing-resistant. Layer multiple methods for defense-in-depth."
        />
        <p>
          Authorization enforcement must happen at multiple layers — the API gateway, the service layer, and the data
          access layer. This defense-in-depth approach ensures that if one layer fails (the gateway misroutes a
          request, the service layer has a bug), the data layer prevents unauthorized access. Row-level security in
          databases is the last line of defense — even if the application layer grants access to the wrong tenant&apos;s
          data, the database enforces tenant isolation through row-level policies.
        </p>
        <p>
          The principle of least privilege is the foundation of authorization design. Every principal should have only
          the permissions necessary to perform their role, and no more. This means starting with zero permissions and
          adding permissions as needed, rather than starting with broad permissions and removing them. The principle
          applies at every level — user permissions, service-to-service permissions, API scopes, and database
          privileges. Overly broad permissions are the most common cause of data breaches, because they give attackers
          more access than they need once they compromise a credential.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The authentication and authorization architecture consists of four components: the identity provider (IdP),
          the API gateway, the service layer, and the policy engine. The IdP manages user identities, verifies
          credentials, issues tokens, and handles lifecycle events (password resets, MFA enrollment, account
          deactivation). The API gateway validates tokens, enforces rate limits, and routes requests to the
          appropriate service. The service layer implements business logic and enforces authorization policies on
          each request. The policy engine evaluates access policies and returns allow/deny decisions to the service
          layer.
        </p>
        <p>
          The request flow begins with the client presenting credentials to the IdP (username/password, MFA code, or
          federated identity). The IdP verifies the credentials and issues an identity token (JWT or session cookie).
          The client includes the token in each subsequent request (Authorization: Bearer header or cookie). The API
          gateway validates the token&apos;s signature, expiration, and issuer, and forwards the request to the appropriate
          service. The service extracts the principal identity from the token, evaluates the authorization policy for
          the requested action, and processes or rejects the request based on the policy decision.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/authentication-vs-authorization-diagram-3.svg"
          alt="Authorization enforcement at API gateway, service layer, and data layer showing defense-in-depth approach"
          caption="Authorization must be enforced at every layer: the gateway validates tokens, the service evaluates permissions, and the database enforces row-level security. Each layer is a safety net against the others failing."
        />
        <p>
          Service-to-service authentication follows a different pattern. Services authenticate to each other using
          mutual TLS (mTLS), where both the client and server present certificates, or using service account tokens
          (OAuth 2.0 client credentials flow). The service account token is obtained from the IdP using the service&apos;s
          client credentials (client ID and client secret, or a signed JWT assertion). The token is then presented to
          the target service, which validates the token and evaluates the authorization policy for the service-to-service
          action.
        </p>
        <p>
          Policy evaluation can be centralized (a policy engine such as OPA, AWS IAM, or Cedar evaluates all
          authorization decisions) or decentralized (each service implements its own authorization logic). Centralized
          policy engines provide consistent policy management, audit logging, and policy versioning, but introduce a
          dependency and potential single point of failure. Decentralized authorization is more resilient and
          lower-latency, but policies can drift across services, making auditing and compliance difficult. The
          recommended approach for most organizations is a hybrid — centralized policy definition with decentralized
          evaluation (the policy engine distributes policies to each service, which evaluates them locally).
        </p>
        <p>
          Session management is the operational practice of maintaining authentication state across requests. For
          web applications, sessions are typically maintained through cookies (session cookies or JWT cookies). For
          APIs, sessions are maintained through bearer tokens (JWTs or opaque tokens). The session lifecycle includes
          creation (login), renewal (token refresh), and termination (logout, token revocation, session expiration).
          Session termination is the most challenging — revoking a JWT requires maintaining a denylist, while
          revoking a session cookie requires deleting the server-side session record. For high-security systems,
          session termination should be immediate — the principal should not be able to use a revoked token or session
          for any purpose.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          JWT versus opaque tokens is the primary trade-off in token-based authentication. JWTs are self-contained —
          they carry claims (user identity, roles, scopes) that the resource server can read without calling the
          identity provider. This enables stateless authentication, which is simpler to scale and operate. However,
          JWTs cannot be revoked until they expire — if a JWT is compromised, it remains valid until expiration.
          Opaque tokens are references to server-side session state — the resource server must call the identity
          provider to validate the token and retrieve the claims. This enables immediate revocation (the identity
          provider can delete the session record, making the token invalid), but introduces a network dependency and
          latency on each request.
        </p>
        <p>
          RBAC versus ABAC is the primary trade-off in authorization design. RBAC is simple — permissions are
          assigned to roles, and roles are assigned to users. It is easy to understand, audit, and manage. However,
          it is coarse-grained — a role grants the same permissions to all users who have that role, regardless of
          context. ABAC is fine-grained — policies evaluate attributes of the user, resource, action, and environment
          (for example, &quot;users can access documents they own, but only during business hours, and only from the
          corporate network&quot;). However, ABAC is complex to manage — policies can become numerous and difficult to
          audit, and policy evaluation is slower than RBAC role lookup.
        </p>
        <p>
          Centralized versus decentralized policy evaluation is a trade-off between consistency and resilience.
          Centralized policy engines ensure that all services enforce the same policies, making auditing and
          compliance straightforward. However, they introduce a dependency — if the policy engine is unavailable,
          services cannot evaluate policies and must fail open (allow all requests) or fail closed (deny all
          requests). Decentralized policy evaluation eliminates this dependency — each service evaluates policies
          locally, so it remains operational even if the central policy engine is unavailable. However, policies can
          drift across services, making auditing and compliance difficult.
        </p>
        <p>
          Federation versus local identity is a trade-off between operational simplicity and control. Federated
          identity (OIDC, SAML) delegates authentication to a trusted identity provider (Google, GitHub, corporate
          IdP), eliminating the need to manage passwords, MFA, and account lifecycle locally. However, it introduces
          a dependency on the identity provider — if the IdP is unavailable, users cannot authenticate. Local identity
          gives full control over the authentication process, but requires managing password storage, MFA enrollment,
          account recovery, and security incident response — all of which are complex and error-prone.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Enforce authorization at every layer — the API gateway, the service layer, and the data access layer. Do
          not trust the gateway&apos;s authentication without performing your own authorization check. Do not trust the
          service layer&apos;s authorization without enforcing row-level security in the database. Defense-in-depth is the
          only reliable approach to authorization — a single enforcement point is a single point of failure.
        </p>
        <p>
          Use short-lived tokens with refresh rotation. Access tokens should expire in 5-15 minutes, limiting the
          window of opportunity if a token is compromised. Refresh tokens should be rotated on each use — the old
          refresh token is invalidated when a new one is issued, so that if a refresh token is stolen and used, the
          system can detect the reuse and revoke the entire token family.
        </p>
        <p>
          Implement the principle of least privilege at every level. Users should have only the permissions necessary
          for their role. Services should have only the permissions necessary for their function. API scopes should
          be narrowly defined — avoid broad scopes like &quot;full access&quot; in favor of granular scopes like
          &quot;read:orders&quot; and &quot;write:orders.&quot; Database privileges should be limited to the minimum necessary — the
          application should not have DROP TABLE or ALTER TABLE privileges in production.
        </p>
        <p>
          Log all authentication and authorization events — successful logins, failed logins, token issuance, token
          validation, permission grants, and permission denials. These logs are essential for incident response —
          when a breach occurs, the logs tell you who authenticated, what they accessed, and when. Without these
          logs, you cannot determine the scope of a breach or the actions the attacker took.
        </p>
        <p>
          Test authorization policies regularly — not just for correctness (does the policy allow the right
          actions?), but for security (does the policy deny the wrong actions?). Automated testing should include
          negative test cases — verify that a user without the &quot;admin&quot; role cannot perform admin actions, that a
          user from tenant A cannot access tenant B&apos;s data, and that a service without the &quot;write&quot; scope cannot
          modify resources.
        </p>
        <p>
          Use a policy engine for complex authorization. If your authorization logic is more complex than &quot;check the
          user&apos;s role,&quot; use a policy engine (OPA, Cedar, AWS IAM) rather than implementing authorization logic in
          each service. Policy engines provide a declarative language for policies, centralized policy management,
          audit logging, and policy versioning. They also enable policy testing — you can test policies in isolation
          before deploying them to production.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Treating authentication as authorization is the most common pitfall. Many systems authenticate users
          (verify their identity) and then assume that authenticated users are authorized to perform any action. This
          is equivalent to having no authorization at all. The fix is to implement authorization checks on every
          request, verifying that the authenticated principal has the necessary permissions for the requested action.
        </p>
        <p>
          Implementing authorization only at the API gateway is a dangerous pitfall. The gateway may validate tokens
          and enforce rate limits, but if the service layer does not perform its own authorization check, a request
          that bypasses the gateway (through a direct service-to-service call or a misconfigured route) will not be
          authorized. The fix is to enforce authorization at every layer — the gateway, the service, and the database.
        </p>
        <p>
          Using long-lived tokens without revocation is a common operational pitfall. If an access token has a
          24-hour expiration and is compromised, the attacker has 24 hours of access. The fix is to use short-lived
          access tokens (5-15 minutes) with refresh rotation — if a refresh token is compromised and used, the system
          detects the reuse and revokes the entire token family, limiting the attacker&apos;s access.
        </p>
        <p>
          Overly broad permissions (the &quot;admin&quot; role grants all permissions) is a common authorization design
          pitfall. It violates the principle of least privilege and gives users more access than they need, increasing
          the impact of a compromised credential. The fix is to define granular permissions and assign only the
          permissions necessary for each role. Start with zero permissions and add permissions as needed, rather than
          starting with all permissions and removing them.
        </p>
        <p>
          Not testing negative authorization cases is a common testing pitfall. Tests verify that authorized users
          can perform authorized actions, but do not verify that unauthorized users cannot perform unauthorized
          actions. This means that authorization bugs (a missing permission check, an overly permissive policy) go
          undetected until they are exploited in production. The fix is to include negative test cases in every
          authorization test — verify that a user without the &quot;delete&quot; permission cannot delete resources, that a
          user from tenant A cannot access tenant B&apos;s data, and that a service without the &quot;admin&quot; scope cannot
          perform admin actions.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses OIDC for authentication and RBAC for authorization. Users authenticate
          through the platform&apos;s identity provider (which supports passwords, MFA, and federated identity through
          Google and Apple). The identity provider issues JWTs with short expiration (15 minutes) and refresh tokens
          with rotation. The API gateway validates JWTs and enforces rate limits. The service layer evaluates RBAC
          policies (admin, manager, customer roles) to determine what actions each user can perform. The database
          enforces row-level security to ensure that customers can only access their own orders. The platform logs
          all authentication and authorization events for audit and incident response.
        </p>
        <p>
          A financial services company uses mTLS for service-to-service authentication and ABAC for authorization.
          Services authenticate to each other using mutual TLS, where both the client and server present certificates.
          The policy engine (OPA) evaluates ABAC policies based on attributes of the service (its identity, its
          environment, its security posture) and the requested action. For example, a policy may require that a
          service accessing customer data must be running in a production environment, must have a valid security
          certificate, and must have the &quot;customer-data&quot; scope. The policy engine returns an allow/deny decision,
          which the service enforces before processing the request.
        </p>
        <p>
          A healthcare organization uses SAML for federated authentication and ReBAC for authorization. Healthcare
          providers authenticate through their organization&apos;s identity provider (Active Directory, Okta) using SAML.
          The identity provider issues SAML assertions that are exchanged for JWTs. The authorization system uses
          ReBAC — providers can access patient records for patients they are assigned to (the relationship is
          established through the care team assignment). When a provider is reassigned to a different care team,
          their access to the previous team&apos;s patients is automatically revoked. The system logs all access events
          for HIPAA compliance auditing.
        </p>
        <p>
          A SaaS platform uses passkeys (WebAuthn) for passwordless authentication and a custom policy engine for
          multi-tenant authorization. Users authenticate using passkeys — biometric or security key authentication
          that is phishing-resistant and immune to credential theft. The authorization system enforces multi-tenant
          isolation — users can only access resources within their organization&apos;s tenant. The policy engine evaluates
          policies based on the user&apos;s role within the organization (admin, member, viewer), the resource type
          (document, project, setting), and the action (read, write, delete, admin). The platform supports customer-managed
          identity providers (OIDC federation) for enterprise customers who want to use their own IdP.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between authentication and authorization, and why must they be implemented separately?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Authentication verifies identity — it answers &quot;Who are you?&quot; through credential validation (passwords, tokens, certificates). Authorization enforces permissions — it answers &quot;What can you do?&quot; through policy evaluation (RBAC, ABAC, ACL). They must be implemented separately because authentication alone is insufficient for security — an authenticated user with unrestricted access is equivalent to no access control at all.
            </p>
            <p>
              The separation also enables independent evolution — you can change your authentication method (passwords to passkeys) without changing your authorization policies, and vice versa. It also enables defense-in-depth — if authentication is compromised, authorization still limits what the attacker can do.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you handle token revocation in a JWT-based authentication system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JWTs are self-contained and cannot be revoked until they expire. To handle revocation, use short-lived access tokens (5-15 minutes) with refresh token rotation. When a refresh token is used, the old refresh token is invalidated and a new one is issued. If a refresh token is compromised and reused, the system detects the reuse and revokes the entire token family.
            </p>
            <p>
              For immediate revocation (logout, account compromise), maintain a token denylist (a database of revoked token IDs). Each resource server checks the denylist when validating a JWT. The denylist should be distributed to all resource servers with low latency (using a cache or a distributed data store). Alternatively, use opaque tokens instead of JWTs — opaque tokens are references to server-side session state, so revocation is immediate (delete the session record).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the principle of least privilege, and how do you implement it in a distributed system?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The principle of least privilege states that every principal (user, service, process) should have only the permissions necessary to perform its role, and no more. In a distributed system, this means: users have only the permissions necessary for their role, services have only the permissions necessary for their function, API scopes are narrowly defined, and database privileges are limited to the minimum necessary.
            </p>
            <p>
              Implementation starts with zero permissions — deny all actions by default, then grant permissions as needed. Use granular permissions (read:orders, write:orders) instead of broad permissions (full access). Regularly audit permissions to remove unused or excessive permissions. Test that unauthorized actions are denied — include negative test cases in your authorization tests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you enforce authorization in a microservices architecture?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Enforce authorization at every layer: the API gateway validates tokens and enforces rate limits, the service layer evaluates authorization policies for each request, and the database enforces row-level security for tenant isolation. Do not trust the gateway&apos;s authentication without performing your own authorization check — this is the most common cause of authorization bypass vulnerabilities.
            </p>
            <p>
              For service-to-service authorization, use mTLS or service account tokens. Each service authenticates to the services it calls and presents its own identity. The target service evaluates the authorization policy for the service-to-service action, just as it would for a user request. Use a policy engine (OPA, Cedar) to centralize policy definition while distributing policy evaluation to each service.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are the security implications of using JWTs versus opaque tokens?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JWTs are self-contained — they carry claims that the resource server can read without calling the identity provider. This enables stateless authentication, which is simpler to scale. However, JWTs cannot be revoked until they expire — if a JWT is compromised, it remains valid until expiration. Opaque tokens are references to server-side session state — they require a network call to validate, but enable immediate revocation.
            </p>
            <p>
              The choice depends on your security requirements. If immediate revocation is required (financial systems, healthcare), use opaque tokens or JWTs with a denylist. If scalability and simplicity are more important (low-risk systems), use JWTs with short expiration (5-15 minutes) and refresh token rotation to limit the impact of token compromise.
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
            <a href="https://openid.net/connect/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenID Connect Specification
            </a> — Authentication layer on top of OAuth 2.0.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749: OAuth 2.0
            </a> — The OAuth 2.0 authorization framework specification.
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc7519" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7519: JSON Web Token (JWT)
            </a> — JWT structure, claims, and signature verification.
          </li>
          <li>
            <a href="https://www.nist.gov/publications/digital-identity-guidelines" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63: Digital Identity Guidelines
            </a> — Comprehensive guidelines for authentication and authorization.
          </li>
          <li>
            <a href="https://www.openpolicyagent.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Open Policy Agent (OPA)
            </a> — General-purpose policy engine for fine-grained authorization.
          </li>
          <li>
            <a href="https://webauthn.guide/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WebAuthn Guide
            </a> — Passkeys and security keys for phishing-resistant authentication.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}